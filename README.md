
# HireSense - AI-Powered Job Matching Platform

**HireSense** is an intelligent job search platform that uses AI to match your resume with job postings, predict interview success, and suggest resume improvements. The system aggregates jobs from multiple sources and helps you track applications efficiently.

## Key Features

- **Smart Job Matching**: Compare resumes against job postings with percentage match scores (0-100%)
- **Interview Probability**: AI predicts your chances of success for each matched job
- **Resume Insights**: AI-generated improvement suggestions to strengthen your resume
- **Application Tracking**: Track and manage your job applications with timestamps and status
- **Multiple Resumes**: Upload and manage different resume versions for different job targets
- **Dashboard**: View match statistics, top opportunities, and application history at a glance

## Tech Stack

**Backend**: Django REST Framework + Celery (async tasks) + PostgreSQL  
**Frontend**: React + TypeScript + Vite + Tailwind CSS  
**AI/LLM**:  Google Generative AI, or Groq for intelligent analysis  
**Storage**: Local filesystem for avatars, Cloudinary for resumes

## Project Structure

```
HireSense/
├── BackEnd/          # Django REST API with job matching & AI integration
├── FrontEnd/         # React web application
```

Key backend modules:
- **`core/`** - API endpoints, models, job sources, async tasks
- **`ai/`** - Resume parsing, job matching, interview prediction, insights generation

## Quick Start

```bash
# Backend
cd BackEnd/app
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd FrontEnd
npm install
npm run dev
```

Access at `http://localhost:5173` (frontend) and `http://localhost:8000` (API)

---

  