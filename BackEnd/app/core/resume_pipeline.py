"""
Resume processing pipeline.

Stages:
1. Extract raw text from PDF/DOC/DOCX
2. Extract structure hints (sections)
3. AI parsing (skills, experience, education)
4. Store in Resume model
5. Generate and save resume insights
"""
import logging
from typing import NamedTuple

from .models import Resume, ResumeInsight
from .resume_utils import extract_with_structure, validate_resume_file

logger = logging.getLogger(__name__)


class PipelineResult(NamedTuple):
    """Result of the resume processing pipeline."""

    raw_text: str
    parsed_content: dict
    structure_hints: dict
    success: bool
    error: str | None = None


def process_resume_file(resume: Resume) -> PipelineResult:
    """
    Full pipeline: extract text -> AI parse -> return result.

    Does NOT save to the Resume instance; caller should update and save.
    """
    # Stage 1: Extract text from file
    if not resume.file:
        return PipelineResult(
            raw_text="",
            parsed_content={},
            structure_hints={},
            success=False,
            error="No file attached",
        )

    is_valid, err = validate_resume_file(resume.file)
    if not is_valid:
        return PipelineResult(
            raw_text="",
            parsed_content={},
            structure_hints={},
            success=False,
            error=err,
        )

    try:
        from io import BytesIO
        
        # Read file bytes into memory to ensure seekability
        # (Cloudinary files may not be natively seekable)
        resume.file.open("rb")
        file_bytes = resume.file.read()
        resume.file.close()
        
        # Create a seekable BytesIO object for extraction libraries
        file_obj = BytesIO(file_bytes)
        extraction = extract_with_structure(file_obj)
    except Exception as e:
        logger.exception("Resume file read failed: %s", e)
        return PipelineResult(
            raw_text="",
            parsed_content={},
            structure_hints={},
            success=False,
            error="Failed to read file",
        )

    raw_text = extraction.raw_text.strip()
    structure_hints = extraction.structure_hints

    if not raw_text:
        return PipelineResult(
            raw_text="",
            parsed_content={},
            structure_hints=structure_hints,
            success=False,
            error="Could not extract text from file",
        )

    # Stage 2 & 3: AI parsing (structure hints available for future enhancement)
    parsed_content = {}
    try:
        from ai.resume_parser import parse_resume

        parsed_content = parse_resume(raw_text) or {}
    except ValueError as e:
        logger.warning("AI parsing skipped (API key missing?): %s", e)
    except Exception as e:
        logger.exception("AI parsing failed: %s", e)

    return PipelineResult(
        raw_text=raw_text,
        parsed_content=parsed_content,
        structure_hints=structure_hints,
        success=True,
    )


def process_resume_text(text: str) -> PipelineResult:
    """
    Pipeline for plain text input (no file).

    Skips file extraction; runs structure detection and AI parsing.
    """
    if not text or not text.strip():
        return PipelineResult(
            raw_text="",
            parsed_content={},
            structure_hints={},
            success=False,
            error="Empty text",
        )

    from .resume_utils import _detect_sections

    structure_hints = _detect_sections(text)
    parsed_content = {}

    try:
        from ai.resume_parser import parse_resume

        parsed_content = parse_resume(text) or {}
    except ValueError as e:
        logger.warning("AI parsing skipped: %s", e)
    except Exception as e:
        logger.exception("AI parsing failed: %s", e)

    return PipelineResult(
        raw_text=text.strip(),
        parsed_content=parsed_content,
        structure_hints=structure_hints,
        success=True,
    )


def run_pipeline_and_save(resume: Resume) -> PipelineResult:
    """
    Run the full pipeline and save results to the Resume instance.
    Also generates and saves AI resume insights.
    """
    result = process_resume_file(resume)

    resume.raw_text = result.raw_text
    # Store parsed content + structure hints for AI analysis
    content = dict(result.parsed_content)
    if result.structure_hints:
        content["structure_hints"] = result.structure_hints
    resume.parsed_content = content
    resume.save(update_fields=["raw_text", "parsed_content"])

    # Generate and save resume insights
    if result.success and resume.raw_text:
        try:
            from ai.insight_generator import generate_insights

            insights = generate_insights(resume.raw_text, content)
            if insights:
                ResumeInsight.objects.filter(user=resume.user).delete()
                for item in insights:
                    ResumeInsight.objects.create(
                        user=resume.user,
                        resume=resume,
                        category=item["category"],
                        title=item["title"],
                        description=item["description"],
                        impact=item["impact"],
                    )
        except ValueError as e:
            logger.warning("Insight generation skipped: %s", e)
        except Exception as e:
            logger.exception("Insight generation failed: %s", e)

    return result
