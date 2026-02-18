# HireSense AI Integration – Step-by-Step Directives

Follow these directives in order to integrate OpenAI for resume parsing, job matching, and interview probability estimation.

---

## Prerequisites

- [ ] Python 3.11+ installed
- [ ] Django backend project created (in `Backend/` or equivalent)
- [ ] OpenAI API key obtained and kept secure

---

## Step 1: Install Dependencies

Add to your `requirements.txt` (or `pyproject.toml`):

```
openai>=1.0.0
python-dotenv>=1.0.0
```

Run:

```bash
pip install openai python-dotenv
```

---

## Step 2: Secure API Key Storage

**2.1** Create a `.env` file in the backend root (if it does not exist):

```
OPENAI_API_KEY=sk-your-key-here
```

**2.2** Add `.env` to `.gitignore`:

```
.env
*.env
.env.local
```

**2.3** Load the key in Django settings (e.g. `settings.py`):

```python
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY must be set in environment")
```

---

## Step 3: Create the OpenAI Service Layer

**3.1** Create the directory structure:

```
BackEnd/app/
└── ai/
        ├── __init__.py
        ├── client.py
        ├── resume_parser.py
        ├── job_matcher.py
        └── interview_predictor.py
```

**3.2** In `ai/client.py`, create a shared OpenAI client:

```python
from openai import OpenAI
from django.conf import settings

def get_client() -> OpenAI:
    return OpenAI(api_key=settings.OPENAI_API_KEY)
```

---

## Step 4: Implement Resume Parsing

**4.1** In `ai/resume_parser.py`:

- Accept resume text (string) as input.
- Call OpenAI with a system + user prompt to extract:
  - `skills`: list of strings
  - `experience`: list of {title, company, dates, description}
  - `education`: list of {degree, institution, dates}
- Use structured output (JSON mode or response format) for consistent parsing.
- Return a Python dict with these keys.

**4.2** Prompt structure:

- System: "You extract structured data from resumes. Return valid JSON only."
- User: "Extract from this resume:\n\n{resume_text}"
- Parse JSON from the response and validate required keys exist.

**4.3** Error handling:

- Catch `openai.APIError` and `json.JSONDecodeError`.
- Return `None` or raise a custom exception on failure.
- Log errors for debugging.

---

## Step 5: Implement Job Description Matching

**5.1** In `ai/job_matcher.py`:

- Accept: `resume_text` (or parsed resume dict) and `job_description_text`.
- Call OpenAI to compute a match score (0–100) and structured output:
  - `match_score`: int
  - `matched_skills`: list of strings
  - `missing_skills`: list of strings
  - `reasoning`: string (optional)

**5.2** Prompt structure:

- System: "You compare resumes to job descriptions and return match analysis as JSON."
- User: "Resume:\n{resume_text}\n\nJob:\n{job_description}\n\nReturn JSON: match_score (0-100), matched_skills, missing_skills, reasoning."

**5.3** Return a dict that maps directly to your `JobMatch` fields (`matchScore`, `skills`, `missingSkills`).

---

## Step 6: Implement Interview Probability Estimation

**6.1** In `ai/interview_predictor.py`:

- Accept: match analysis (from Step 5) plus optional context (e.g. job seniority, company size).
- Call OpenAI to estimate interview probability (0–100) and brief factors.

**6.2** Prompt structure:

- System: "Based on resume-job match analysis, estimate the probability (0-100) the candidate gets an interview."
- User: "Match analysis:\n{match_analysis}\n\nReturn JSON: interview_probability, key_factors (list)."

**6.3** Return a dict with `interview_probability` and `key_factors`.

---

## Step 7: Add Django API Endpoints

**7.1** Create or update a `resumes` app (or equivalent) with:

- `POST /api/resumes/parse/` – accepts resume text (or file); calls `resume_parser`; returns parsed data.
- `POST /api/jobs/match/` – accepts resume text + job description; calls `job_matcher`; returns match analysis.

**7.2** Optionally create a combined endpoint:

- `POST /api/jobs/full-analysis/` – resume text + job description; runs matcher + predictor; returns match score and interview probability.

**7.3** Protect all endpoints with authentication (e.g. JWT/session).

---

## Step 8: Connect to Resume Upload Flow

**8.1** In the view that handles resume upload:

1. Read file content (PDF/DOC/DOCX).
2. Extract text (e.g. PyPDF2, python-docx).
3. Call `resume_parser` with the extracted text.
4. Store parsed result in DB (e.g. `Resume.parsed_data` JSONField).
5. Return parsed data to the frontend.

---

## Step 9: Connect to Job Scan Flow

**9.1** When a job is fetched (from scraping or API):

1. Get user’s current resume text (or parsed data).
2. Get job description text.
3. Call `job_matcher`.
4. Call `interview_predictor` with match analysis.
5. Create/update `JobMatch` with `matchScore`, `interviewProbability`, `skills`, `missingSkills`.

---

## Step 10: Add Rate Limiting and Resilience

**10.1** Add retries for OpenAI calls:

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def call_openai(...):
    ...
```

**10.2** Apply rate limiting to AI endpoints (e.g. django-ratelimit or DRF throttling).

**10.3** Use async/background tasks (Celery) for heavy flows (e.g. batch job matching) so the API responds quickly.

---

## Step 11: Test Each Component

**11.1** Unit tests:

- `test_resume_parser_returns_valid_structure`
- `test_job_matcher_returns_score_and_skills`
- `test_interview_predictor_returns_probability`

**11.2** Integration test:

- Upload a sample resume → parse → verify structure.
- Provide resume + job description → verify match score and interview probability.

---

## Step 12: Wire Up the Frontend

**12.1** Replace mock data in `mockData.ts` usages with API calls to:

- Resume parse endpoint (after upload).
- Job match / full-analysis endpoint.

**12.2** Handle loading and error states for AI calls.

---

## Implementation Note

The AI integration has been implemented at `BackEnd/app/ai/`. Use the project venv:
`source BackEnd/venv/bin/activate` before running the backend.

## Checklist Summary

- [x] Step 1: Install `openai` and `python-dotenv`
- [x] Step 2: Store `OPENAI_API_KEY` in `.env` and load in settings
- [x] Step 3: Create `ai/` package and `client.py`
- [x] Step 4: Implement `resume_parser.py`
- [x] Step 5: Implement `job_matcher.py`
- [x] Step 6: Implement `interview_predictor.py`
- [x] Step 7: Add Django API endpoints for parse and match
- [x] Step 8: Connect parser to resume upload
- [ ] Step 9: Connect matcher/predictor to job scan (when job scraping is implemented)
- [x] Step 10: Add retries (tenacity), rate limiting and background tasks pending
- [ ] Step 11: Write and run tests
- [ ] Step 12: Replace frontend mock data with API calls
