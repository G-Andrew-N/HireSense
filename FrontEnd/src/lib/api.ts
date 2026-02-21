/**
 * API client for HireSense backend.
 * Uses fetch with JWT auth, proxy in dev: /api -> backend.
 * In production, uses VITE_API_URL environment variable set in Vercel.
 */

const API_BASE = 
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? '/api'  // Dev: use Vite proxy
    : ((import.meta.env as any).VITE_API_URL || 'https://hiresense-0zhv.onrender.com/api');  // Production: use env var or fallback

export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

async function getToken(): Promise<string | null> {
  return localStorage.getItem('access');
}

async function setTokens(access: string, refresh: string): Promise<void> {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
}

async function clearTokens(): Promise<void> {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return null;
  const res = await fetch(`${API_BASE}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const access = data.access;
  if (access) {
    localStorage.setItem('access', access);
    if (data.refresh) localStorage.setItem('refresh', data.refresh);
    return access;
  }
  return null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const token = await getToken();

  const headers: HeadersInit = {
    ...(options.headers as Record<string, string>),
  };
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.body instanceof FormData && headers['Content-Type']) {
    delete headers['Content-Type'];
  }

  let res = await fetch(url, { ...options, headers });

  // Retry once with refreshed token on 401
  if (res.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    }
  }

  if (!res.ok) {
    let errBody: ApiError = {};
    try {
      errBody = await res.json();
    } catch {
      errBody = { detail: res.statusText };
    }
    const err = new Error(errBody.detail || `Request failed: ${res.status}`);
    (err as Error & { status?: number; body?: ApiError }).status = res.status;
    (err as Error & { status?: number; body?: ApiError }).body = errBody;
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export interface LoginResponse {
  user: { id: number; email: string; first_name: string; last_name: string };
  access: string;
  refresh: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await setTokens(data.access, data.refresh);
  return data;
}

export interface RegisterResponse extends LoginResponse {}

export async function register(
  email: string,
  password: string,
  full_name?: string,
  avatar?: File
): Promise<RegisterResponse> {
  let data: RegisterResponse;
  if (avatar) {
    const form = new FormData();
    form.set('email', email);
    form.set('password', password);
    if (full_name) form.set('full_name', full_name);
    form.set('avatar', avatar);
    data = await apiRequest<RegisterResponse>('/auth/register/', {
      method: 'POST',
      body: form,
    });
  } else {
    data = await apiRequest<RegisterResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });
  }
  await setTokens(data.access, data.refresh);
  return data;
}

export async function logout(): Promise<void> {
  const refresh = localStorage.getItem('refresh');
  if (refresh) {
    try {
      await apiRequest('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh }),
      });
    } catch {
      /* ignore */
    }
  }
  await clearTokens();
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiRequest('/auth/password-reset/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(
  uid: string,
  token: string,
  new_password: string
): Promise<void> {
  await apiRequest('/auth/password-reset/confirm/', {
    method: 'POST',
    body: JSON.stringify({ uid, token, new_password }),
  });
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  /** Profile photo URL (absolute). */
  avatar: string | null;
  /** Get daily summaries of new matches via email. */
  email_notifications?: boolean;
  /** Instant alerts for 85%+ matches. */
  high_match_alerts?: boolean;
  /** Summary of activity and insights sent weekly. */
  weekly_reports?: boolean;
}

export async function getMe(): Promise<User> {
  return apiRequest<User>('/auth/me/');
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  avatar?: File;
  email_notifications?: boolean;
  high_match_alerts?: boolean;
  weekly_reports?: boolean;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { avatar, ...rest } = payload;
  if (avatar) {
    const form = new FormData();
    if (rest.first_name !== undefined) form.set('first_name', rest.first_name);
    if (rest.last_name !== undefined) form.set('last_name', rest.last_name);
    if (rest.email_notifications !== undefined) form.set('email_notifications', String(rest.email_notifications));
    if (rest.high_match_alerts !== undefined) form.set('high_match_alerts', String(rest.high_match_alerts));
    if (rest.weekly_reports !== undefined) form.set('weekly_reports', String(rest.weekly_reports));
    form.set('avatar', avatar);
    return apiRequest<User>('/auth/me/', { method: 'PATCH', body: form });
  }
  return apiRequest<User>('/auth/me/', {
    method: 'PATCH',
    body: JSON.stringify(rest),
  });
}

// Resumes
export interface Resume {
  id: number;
  file: string;
  original_filename: string;
  uploaded_at: string;
  version: number;
  parsed_content: Record<string, unknown>;
  raw_text: string;
  is_primary?: boolean;
}

export interface MatchAnalysisStatus {
  started: boolean;
  async?: boolean;
  task_id?: string | null;
  result?: Record<string, unknown> | null;
  reason?: string;
  error?: string;
}

export async function getResumes(): Promise<Resume[]> {
  const data = await apiRequest<Resume[]>('/resumes/');
  return Array.isArray(data) ? data : [];
}

export async function uploadResume(file: File, onProgress?: (p: number) => void): Promise<Resume> {
  const form = new FormData();
  form.append('file', file);

  // Use XMLHttpRequest to get upload progress events
  const token = localStorage.getItem('access');
  return new Promise<Resume>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${API_BASE}/resumes/`;
    xhr.open('POST', url, true);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.round((e.loaded / e.total) * 100);
        try {
          onProgress(pct);
        } catch {}
      }
    };

    xhr.onload = () => {
      const status = xhr.status;
      const text = xhr.responseText || '';
      if (status >= 200 && status < 300) {
        try {
          const data = JSON.parse(text || '{}');
          resolve(data as Resume);
        } catch (err) {
          reject(new Error('Invalid JSON response'));
        }
      } else {
        let errBody: ApiError = { detail: xhr.statusText };
        try {
          errBody = JSON.parse(text || '{}');
        } catch {}
        const err = new Error(errBody.detail || `Request failed: ${status}`) as Error & { status?: number; body?: ApiError };
        err.status = status;
        err.body = errBody;
        reject(err);
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(form);
  });
}

/** Download resume file (auth required). Triggers browser download. */
export async function downloadResume(id: number, filename: string): Promise<void> {
  const token = localStorage.getItem('access');
  const url = `${API_BASE}/resumes/${id}/download/`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename || 'resume.pdf';
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function deleteResume(id: number): Promise<void> {
  await apiRequest(`/resumes/${id}/`, { method: 'DELETE' });
}

/** Set this resume as the current one (used for job matches and insights). */
export async function setResumePrimary(id: number): Promise<Resume> {
  return apiRequest<Resume>(`/resumes/${id}/set_primary/`, { method: 'POST' });
}

// Job matches
export interface JobMatch {
  id: number | null;  // null for pending jobs (not yet analyzed)
  title: string;
  company: string;
  location: string;
  match_score?: number | null;
  interview_probability?: number | null;
  salary: string;
  posted_date: string | null;
  source: string;
  logo?: string;
  external_url: string;
  skills?: string[];
  missing_skills?: string[];
  created_at: string;
  /** When the user marked this job as applied (ISO date string). */
  applied_at?: string | null;
  /** 'analyzing' for pending jobs, undefined for completed matches */
  status?: 'analyzing';
}

export interface JobMatchesResponse {
  results: JobMatch[];
  count: number;
  pending_count: number;
  matched_count: number;
}

export async function getJobMatches(): Promise<JobMatch[]> {
  const data = await apiRequest<JobMatch[]>('/job-matches/');
  return Array.isArray(data) ? data : [];
}

export async function getJobMatchesWithPending(): Promise<JobMatchesResponse> {
  return apiRequest<JobMatchesResponse>('/job-matches/with_pending/');
}

/** Mark a job match as applied or unmark. Applications = count of matches with applied_at set. */
export async function markJobMatchApplied(id: number, applied: boolean): Promise<JobMatch> {
  const url = `/job-matches/${id}/`;
  const body = { applied_at: applied ? new Date().toISOString() : null };
  return apiRequest<JobMatch>(url, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function triggerJobScan(sync = true): Promise<{ task_id?: string; total_stored?: number }> {
  const url = sync ? '/jobs/scan/?sync=true' : '/jobs/scan/';
  return apiRequest<{ task_id?: string; total_stored?: number; detail?: string }>(url, { method: 'POST' });
}

export async function triggerMatchAnalysis(sync = true): Promise<{ task_id?: string; matches_created?: number }> {
  const url = sync ? '/jobs/run-match-analysis/?sync=true' : '/jobs/run-match-analysis/';
  return apiRequest<{ task_id?: string; matches_created?: number; detail?: string }>(url, { method: 'POST' });
}

/** Chunked match analysis: process a few jobs and return new matches. For progressive rendering. */
export async function triggerMatchAnalysisChunk(
  chunkSize = 3
): Promise<{ matches: JobMatch[]; has_more: boolean }> {
  const url = `/jobs/run-match-analysis/?sync=true&chunk=${chunkSize}`;
  const data = await apiRequest<{ matches: JobMatch[]; has_more: boolean }>(url, { method: 'POST' });
  return { matches: data.matches ?? [], has_more: data.has_more ?? false };
}

// Insights
export interface ResumeInsight {
  id: number;
  category: 'critical' | 'important' | 'suggestion';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  created_at: string;
  /** When the user marked this suggestion as completed (applied manually). */
  completed_at: string | null;
}

export async function getInsights(): Promise<ResumeInsight[]> {
  const data = await apiRequest<ResumeInsight[]>('/insights/');
  return Array.isArray(data) ? data : [];
}

export async function generateInsights(): Promise<ResumeInsight[]> {
  const data = await apiRequest<ResumeInsight[]>('/insights/generate/', { method: 'POST' });
  return Array.isArray(data) ? data : [];
}

/** Mark an insight as completed (after applying manually) or clear completed state. */
export async function markInsightCompleted(id: number, completed: boolean): Promise<ResumeInsight> {
  const url = `/insights/${id}/`;
  const body = { completed_at: completed ? new Date().toISOString() : null };
  return apiRequest<ResumeInsight>(url, { method: 'PATCH', body: JSON.stringify(body) });
}

// Job sites
export interface JobSite {
  id: number;
  name: string;
  url: string;
  enabled: boolean;
  logo?: string;
  is_builtin: boolean;
  source_type?: string;
  scrape_config?: Record<string, unknown>;
  created_at: string;
}

export async function getJobSites(): Promise<JobSite[]> {
  const data = await apiRequest<JobSite[]>('/job-sites/');
  return Array.isArray(data) ? data : [];
}

export async function updateJobSite(
  id: number,
  patch: Partial<Pick<JobSite, 'enabled' | 'name' | 'url'>>
): Promise<JobSite> {
  return apiRequest<JobSite>(`/job-sites/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function createJobSite(data: { name: string; url: string }): Promise<JobSite> {
  return apiRequest<JobSite>('/job-sites/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteJobSite(id: number): Promise<void> {
  await apiRequest(`/job-sites/${id}/`, { method: 'DELETE' });
}
