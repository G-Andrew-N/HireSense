
# HireSense - AI-Powered Job Matching Platform

HireSense is an intelligent job application platform that uses AI to match resumes with job postings, provides interview probability predictions, and offers personalized resume improvement suggestions. It aggregates job listings from multiple sources and helps job seekers track their applications efficiently.

## What is HireSense?

HireSense is a full-stack web application designed to revolutionize the job search and application process by leveraging AI and machine learning. The platform:

- **Aggregates jobs** from multiple sources (RSS feeds, web scrapers, job boards like Indeed, LinkedIn, ZipRecruiter, Glassdoor)
- **Matches resumes** with job postings using intelligent algorithms (0-100 match scores)
- **Predicts interview probability** for each matched job based on skills alignment
- **Identifies missing skills** in your resume versus job requirements
- **Generates resume insights** with AI-powered suggestions for improvement (critical, important, or general suggestions)
- **Tracks applications** with timestamps and application status
- **Manages multiple resumes** with version control for different job targets
- **Provides a rich dashboard** showing job matches, applications, insights, and notifications

## System Architecture

### Backend (Django + Celery)
- **Framework**: Django REST Framework for API endpoints
- **Job Aggregation**: Multiple fetchers (RSS, generic web scraper, specialized API integrations)
- **File Processing**: Resume parsing from PDF and DOCX formats; avatar storage on local filesystem
- **Media Serving**: Dedicated CORS-enabled views for serving avatars at `/api/media/avatars/`
- **Default Avatars**: Built-in humanoid SVG avatar for users without custom profile pictures
- **Task Queue**: Celery with Redis for async job fetching and AI processing
- **AI Integration**: Support for multiple LLM providers (OpenAI, Google Generative AI, Groq)
- **Database**: PostgreSQL (production) / SQLite (development)

### Frontend (React + TypeScript + Vite)
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS for responsive design
- **State Management**: React Context for authentication and app-wide state
- **Pages**: Dashboard, Job Matches, Resume Manager, Insights, Settings, Authentication

## Key Features

### Job Matching
- Compare resume against job postings with percentage match score
- Identify matching and missing skills
- Filter and sort matches by score, date, or company
- Optimized job search with 10-15 second timeout for responsive user experience

### Dashboard
- Real-time job match metrics and statistics
- Empty state guidance when users haven't uploaded resumes yet
- Activity charts and top matches visualization
- Quick access to resume management and job scanning

### Resume Intelligence
- AI generates actionable improvement suggestions
- Track completed improvements with timestamps
- Suggestions categorized by importance (critical, important, suggestion)
- Support for multiple resume versions

### Job Aggregation
- Built-in support for popular job boards (Indeed, LinkedIn, Glassdoor, ZipRecruiter, Remotive)
- Custom RSS feed support
- Generic web scraper for custom job sites
- Configurable scraping with keywords and location filters

### Application Tracking
- Mark jobs as applied with timestamp
- View application history
- Filter by status (matched, applied, etc.)

### User Profiles
- Profile avatars with default humanoid SVG for new users
- Local filesystem avatar storage with CORS-enabled media serving
- Email notification preferences
- Multiple resume management with primary resume selection
- Settings and preferences management

## Project Structure

```
HireSense/
├── BackEnd/                    # Django REST API
│   └── app/
│       ├── ai/                 # AI modules (resume parsing, job matching, insights)
│       ├── core/               # Main app models, views, serializers
│       │   ├── models.py       # UserProfile, JobPosting, JobMatch, Resume, etc.
│       │   ├── views.py        # API endpoints
│       │   ├── media_views.py  # Avatar and media file serving
│       │   ├── storage.py      # Local avatar storage backend
│       │   ├── job_sources/    # Job fetching implementations
│       │   └── tasks.py        # Celery async tasks
│       └── app/                # Django config (settings, urls, celery)
├── FrontEnd/                   # React + TypeScript frontend
│   └── src/
│       ├── app/               # Main app component and routes
│       ├── pages/             # Page components (Dashboard, JobMatches, etc.)
│       ├── components/        # Reusable UI components
│       ├── lib/               # Utilities, API client, auth context
│       └── styles/            # Global styles, Tailwind config
```

## Core Systems

### Media Serving
- **Avatar Storage**: Local filesystem (`media/avatars/{year}/{month}/filename.jpg`)
- **Default Avatar**: SVG-based humanoid avatar served at `/api/media/avatars/default`
- **Custom Avatars**: Individual avatars served at `/api/media/avatars/{year}/{month}/{filename}`
- **CORS Support**: All media endpoints include proper CORS headers for cross-origin requests
- **Caching**: Media files cached for 1 hour to reduce server load

### Job Search Optimization
- **Chunk-based Processing**: Jobs processed in 2-job chunks to prevent worker timeouts
- **Timeout Handling**: Maximum 10-15 second job search to maintain responsive UI
- **Source Reliability**: Uses stable job sources (Indeed, LinkedIn, ZipRecruiter, Remotive API, We Work Remotely RSS)
- **Graceful Degradation**: Returns partial results if search times out
- **Rate Limiting**: Respects job board limits and implements backoff strategies

### Core Models
- **UserProfile**: Extended user information with avatar and primary resume selection
- **JobPosting**: Raw job listings from various sources
- **JobSite**: Configured job sources (built-in or user-added)
- **Resume**: User resumes with versioning and parsed content
- **JobMatch**: Matched jobs with scores and probabilities
- **ResumeInsight**: AI-generated resume improvement suggestions

## Technology Stack

**Backend:**
- Django 5.x
- Django REST Framework
- Celery + Redis
- PostgreSQL / SQLite
- OpenAI / Google Generative AI / Groq for LLM integration
- PyPDF2, python-docx for resume parsing

**Frontend:**
- React 18+
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Getting Started

### Backend Setup
```bash
cd BackEnd/app
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd FrontEnd
npm install
npm run dev
```

Access the application at `http://localhost:5173` (frontend) and the API at `http://localhost:8000` (backend).

## Features in Development

- Interview preparation guides
- Salary negotiation insights
- LinkedIn integration for profile enrichment
- Email digest notifications
- Mobile app version
- Advanced job filtering and saved searches
- Cover letter generation assistance

## Contributing

This project is part of the HireSense platform. Please follow the coding guidelines and architectural patterns established in the codebase.

---

**Live Project**: https://www.figma.com/design/YsbzlhxvwgYbw5PeieBY0B/Hiresence-Job-Application-App
  