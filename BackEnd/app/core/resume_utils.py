"""Resume file handling: text extraction from PDF, DOC, DOCX."""
import logging
import re
from pathlib import Path
from typing import NamedTuple

logger = logging.getLogger(__name__)

# Supported extensions for resume upload
SUPPORTED_EXTENSIONS = {".pdf", ".doc", ".docx", ".txt"}
MAX_FILE_SIZE_MB = 10


class ExtractionResult(NamedTuple):
    """Result of text extraction with optional structure hints."""

    raw_text: str
    structure_hints: dict  # section_name -> start_index, end_index or list of lines


def extract_text_from_file(file) -> str:
    """
    Extract plain text from an uploaded resume file (PDF, DOC, DOCX, TXT).

    file: Django UploadedFile or file-like object with .name and .read()
    Returns empty string on failure or unsupported format.
    """
    result = extract_with_structure(file)
    return result.raw_text


def extract_with_structure(file) -> ExtractionResult:
    """
    Extract text and structure hints from a resume file.

    Returns ExtractionResult with raw_text and structure_hints (section boundaries).
    """
    if not file:
        return ExtractionResult(raw_text="", structure_hints={})

    name = getattr(file, "name", "") or ""
    ext = Path(name).suffix.lower()

    try:
        if ext == ".pdf":
            raw = _extract_pdf(file)
        elif ext == ".docx":
            raw = _extract_docx(file)
        elif ext == ".doc":
            raw = _extract_doc_fallback(file)
        elif ext == ".txt":
            raw = _extract_txt(file)
        else:
            raw = _extract_fallback(file)

        hints = _detect_sections(raw) if raw.strip() else {}
        return ExtractionResult(raw_text=raw, structure_hints=hints)

    except Exception as e:
        logger.exception("Failed to extract text from %s: %s", name, e)
        return ExtractionResult(raw_text="", structure_hints={})


def _detect_sections(text: str) -> dict:
    """
    Detect resume sections (Experience, Education, Skills, etc.) from raw text.

    Returns dict mapping section names to list of line indices or content snippets.
    """
    section_keywords = [
        "experience", "work history", "employment", "professional experience",
        "education", "academic", "qualifications",
        "skills", "technical skills", "competencies", "expertise",
        "summary", "objective", "profile", "about",
        "certifications", "projects", "achievements",
    ]
    hints = {}
    lines = text.splitlines()
    pattern = re.compile(
        r"^\s*(" + "|".join(re.escape(k) for k in section_keywords) + r")[\s:]*$",
        re.IGNORECASE,
    )

    for i, line in enumerate(lines):
        match = pattern.match(line.strip())
        if match:
            section = match.group(1).strip().rstrip(":").lower()
            # Normalize to canonical names
            if "experience" in section or "work" in section or "employment" in section:
                section = "experience"
            elif "education" in section or "academic" in section:
                section = "education"
            elif "skill" in section or "competenc" in section or "expertise" in section:
                section = "skills"
            elif "summary" in section or "objective" in section or "profile" in section:
                section = "summary"
            if section not in hints:
                hints[section] = []
            hints[section].append(i)

    return hints


def _extract_pdf(file) -> str:
    """Extract text from PDF, preserving page boundaries."""
    from PyPDF2 import PdfReader

    file.seek(0)
    reader = PdfReader(file)
    parts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            parts.append(text.strip())
    return "\n\n".join(parts)


def _extract_docx(file) -> str:
    """Extract text from DOCX, preserving paragraph structure and headings."""
    from docx import Document

    file.seek(0)
    doc = Document(file)
    parts = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if text:
            # Preserve heading hierarchy for structure
            style = para.style.name.lower() if para.style else ""
            if "heading" in style or "title" in style:
                parts.append(f"\n{text}\n")
            else:
                parts.append(text)
    return "\n".join(parts)


def _extract_doc_fallback(file) -> str:
    """
    Fallback for .doc (old Word binary). python-docx does not support .doc.
    Try reading as bytes and decoding, or return empty with log.
    """
    file.seek(0)
    raw = file.read()
    if not isinstance(raw, bytes):
        return str(raw)
    # Try UTF-8 / Latin-1 to salvage any readable text
    for enc in ("utf-8", "latin-1", "cp1252"):
        try:
            text = raw.decode(enc, errors="replace")
            # Heuristic: if we get a lot of readable words, use it
            words = len([w for w in text.split() if w.isalnum() and len(w) > 1])
            if words > 20:
                return text
        except Exception:
            pass
    logger.warning(".doc format not fully supported; install LibreOffice or use DOCX/PDF")
    return ""


def _extract_txt(file) -> str:
    """Extract text from plain .txt file."""
    file.seek(0)
    raw = file.read()
    if isinstance(raw, bytes):
        return raw.decode("utf-8", errors="replace")
    return str(raw)


def _extract_fallback(file) -> str:
    """Fallback: try reading as text."""
    file.seek(0)
    raw = file.read()
    if isinstance(raw, bytes):
        try:
            return raw.decode("utf-8", errors="replace")
        except Exception:
            return ""
    return str(raw) if raw else ""


def validate_resume_file(file) -> tuple[bool, str]:
    """
    Validate resume file type and size.

    Returns (is_valid, error_message).
    Accepts UploadedFile or FieldFile.
    """
    if not file:
        return False, "No file provided"

    name = getattr(file, "name", "") or ""
    ext = Path(name).suffix.lower()

    if ext not in SUPPORTED_EXTENSIONS:
        return False, f"Unsupported format. Use: {', '.join(SUPPORTED_EXTENSIONS)}"

    try:
        size = getattr(file, "size", 0) or 0
        size = int(size)
    except (OSError, ValueError, TypeError, AttributeError):
        size = 0

    if size > MAX_FILE_SIZE_MB * 1024 * 1024:
        return False, f"File too large. Max {MAX_FILE_SIZE_MB}MB."

    return True, ""


def get_job_search_query(resume) -> str:
    """
    Derive a job search query (keywords) from the resume for fetching relevant jobs.

    Uses parsed_content: most recent job title, then top skills, then summary snippet.
    Falls back to first words of raw_text if no parsed_content.
    Returns a short, sanitized query (max 4 words) so job boards are more likely to return results.
    """
    if not resume:
        return "jobs"
    parsed = getattr(resume, "parsed_content", None) or {}
    if isinstance(parsed, str):
        parsed = {}
    raw_query = ""
    # Prefer latest job title (most representative of target role)
    exp = parsed.get("experience") or []
    if isinstance(exp, list):
        for entry in exp:
            if isinstance(entry, dict):
                title = (entry.get("title") or "").strip()
                if title and len(title) < 80:
                    raw_query = title
                    break
    if not raw_query:
        skills = parsed.get("skills") or []
        if isinstance(skills, list):
            words = [s for s in skills if isinstance(s, str) and s.strip()][:3]
            if words:
                raw_query = " ".join(s.strip() for s in words)
    if not raw_query:
        summary = (parsed.get("summary") or "").strip()
        if summary:
            raw_query = summary.split(".", 1)[0].strip()[:60]
    if not raw_query:
        raw = (getattr(resume, "raw_text", None) or "").strip()
        if raw:
            words = [w for w in raw.split() if w.isalnum() and len(w) > 1][:5]
            if words:
                raw_query = " ".join(words)
    if not raw_query:
        return "jobs"
    # Short query works better with Indeed RSS; keep first 4 words, alphanumeric + spaces only
    words = [w for w in raw_query.replace("-", " ").split() if w.isalnum()][:4]
    return " ".join(words) if words else "jobs"
