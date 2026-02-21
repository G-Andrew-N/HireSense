import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { Header } from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useScan } from "../../lib/scan-context";
import {
  getJobMatches,
  getJobMatchesWithPending,
  getResumes,
  markJobMatchApplied,
  triggerMatchAnalysisChunk,
  type JobMatch,
} from "../../lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { motion } from "motion/react";

function toDisplay(j: JobMatch) {
  // Handle pending jobs (analyzing)
  if (j.status === 'analyzing') {
    return {
      id: String(j.id || `pending-${j.external_url}`),
      rawId: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      matchScore: 0,
      interviewProbability: 0,
      salary: j.salary,
      postedDate: j.posted_date ?? "",
      source: j.source,
      externalUrl: j.external_url,
      skills: [],
      missingSkills: [],
      appliedAt: j.applied_at ?? null,
      status: 'analyzing',
    };
  }
  // Handle analyzed jobs
  return {
    id: String(j.id),
    rawId: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    matchScore: j.match_score ?? 0,
    interviewProbability: j.interview_probability ?? 0,
    salary: j.salary,
    postedDate: j.posted_date ?? "",
    source: j.source,
    externalUrl: j.external_url,
    skills: j.skills ?? [],
    missingSkills: j.missing_skills ?? [],
    appliedAt: j.applied_at ?? null,
  };
}

export function JobMatches() {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const { isScanning, setScanning } = useScan();
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiresResume, setRequiresResume] = useState(false);
  const [filter, setFilter] = useState("all");
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [hasAttemptedScan, setHasAttemptedScan] = useState(false);
  const mountedRef = useRef(true);
  
  // Check localStorage to see if user has ever auto-loaded jobs
  const hasAutoLoadedRef = useRef(
    (() => {
      try {
        return localStorage.getItem("hiresense:has-auto-loaded-jobs") === "true";
      } catch {
        return false;
      }
    })()
  );
  
  // Restore scan start time from localStorage if scanning is in progress
  const [scanStartTimeRef] = useState(() => {
    const ref = { current: null as number | null };
    try {
      const stored = localStorage.getItem("hiresense:scan-start-time");
      if (stored) ref.current = parseInt(stored, 10);
    } catch {}
    return ref;
  });

  const load = useCallback(async () => {
    setLoading(true);
    console.log('[JobMatches] load() called');
    try {
      const resumes = await getResumes();
      const hasResume = Array.isArray(resumes) && resumes.length > 0;
      if (!hasResume) {
        if (mountedRef.current) {
          setRequiresResume(true);
          setMatches([]);
        }
        return;
      }
      if (mountedRef.current) setRequiresResume(false);

      // Use the new endpoint that shows both matched and pending (analyzing) jobs
      const response = await getJobMatchesWithPending();
      console.log('[JobMatches] got response:', response);
      if (mountedRef.current) {
        const nextCount = response.results.length;
        setMatches(response.results);
        console.log('[JobMatches] updated state - matches:', nextCount, 'pending: 0');
      }
    } catch (err) {
      console.error('[JobMatches] getJobMatchesWithPending failed:', err);
      try {
        const data = await getJobMatches();
        if (mountedRef.current) setMatches(data);
        console.log('[JobMatches] fallback succeeded');
      } catch (e) {
        console.error('[JobMatches] fallback also failed:', e);
        toast.error("Failed to load matches");
      }
    } finally {
      console.log('[JobMatches] setting loading=false');
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const handleScan = useCallback(async () => {
    if (requiresResume) {
      toast.info("Upload your resume to start finding matching jobs.");
      return;
    }
    setScanning(true);
    setHasAttemptedScan(true);
    try {
      const result = await triggerMatchAnalysisChunk(2);
      const newMatches = result.matches ?? [];
      if (newMatches.length > 0) {
        setMatches((prev) => {
          const existing = new Set(prev.map((m) => m.id));
          const merged = [...prev];
          for (const match of newMatches) {
            if (!existing.has(match.id)) {
              merged.push(match);
            }
          }
          return merged;
        });
      }
    } catch (err: unknown) {
      const errorDetail = (err as { body?: { detail?: string } })?.body?.detail;
      const msg = errorDetail ?? "Search failed";
      toast.error(msg);
    } finally {
      setScanning(false);
      scanStartTimeRef.current = null;
      localStorage.removeItem("hiresense:scan-pending");
      localStorage.removeItem("hiresense:scan-start-time");
    }
  }, [setScanning, requiresResume]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  // Check for pending scan on mount (separate effect to avoid circular dependency)
  useEffect(() => {
    try {
      const pending = localStorage.getItem("hiresense:scan-pending");
      const isAutoScan = localStorage.getItem("hiresense:auto-scan") === "true";
      
      if (pending && mountedRef.current) {
        // Check if scan was recently set (within last 5 seconds)
        // This prevents retrying completed scans when navigating back
        const timestamp = parseInt(pending, 10);
        const now = Date.now();
        if (!isNaN(timestamp) && (now - timestamp) < 5000) {
          localStorage.removeItem("hiresense:scan-pending");
          if (isAutoScan) {
            localStorage.removeItem("hiresense:auto-scan");
            // Show welcoming message for auto-scan
            toast.info("Welcome! We're finding jobs that match your resume...");
          }
          handleScan();
        } else {
          // Scan flag is stale, just clear it
          localStorage.removeItem("hiresense:scan-pending");
          localStorage.removeItem("hiresense:auto-scan");
        }
      }
    } catch { }
  }, [handleScan]);

  // Listen for global scan-start events to clear matches immediately
  useEffect(() => {
    const onScanStart = () => {
      if (mountedRef.current) {
        setMatches([]);
        setScanning(true);
        const now = Date.now();
        scanStartTimeRef.current = now;  // Record when scan started
        try {
          localStorage.setItem("hiresense:scan-start-time", now.toString());
        } catch {}
        toast.info("Searching for jobs based on your latest resume...");
      }
    };
    window.addEventListener("hiresense:scan-start", onScanStart);
    return () => window.removeEventListener("hiresense:scan-start", onScanStart);
  }, [setScanning]);

  // Auto-load first 2 jobs on first visit if user has a resume but no matches
  useEffect(() => {
    const autoLoad = async () => {
      console.log('[JobMatches] Auto-load check:', { loading, isScanning, requiresResume, hasAutoLoaded: hasAutoLoadedRef.current, matchesCount: matches.length });
      
      // Only run after initial load completes
      if (loading) return;
      if (isScanning) return;
      if (requiresResume) return;
      if (hasAutoLoadedRef.current) return; // Already auto-loaded in this browser
      if (matches.length > 0) return; // Already has matches
      
      try {
        console.log('[JobMatches] Checking for resumes...');
        const resumes = await getResumes();
        const hasResume = Array.isArray(resumes) && resumes.length > 0;
        console.log('[JobMatches] Has resume:', hasResume, 'Resume count:', resumes?.length);
        
        if (hasResume) {
          console.log('[JobMatches] Triggering auto-load');
          hasAutoLoadedRef.current = true;
          try {
            localStorage.setItem("hiresense:has-auto-loaded-jobs", "true");
          } catch {}
          toast.info("Finding your first job matches...");
          handleScan();
        }
      } catch (err) {
        console.error('[JobMatches] Auto-load error:', err);
        // Silently fail - user can manually scan if needed
      }
    };

    autoLoad();
  }, [loading, matches.length, isScanning, requiresResume, handleScan]);

  const filteredJobs = matches
    .map(toDisplay)
    .filter((job) => {
      // Always show pending/analyzing jobs regardless of filter
      if (job.status === 'analyzing') return true;
      
      const score = Number(job.matchScore);
      if (Number.isNaN(score)) return true;
      if (filter === "high") return score >= 85;
      if (filter === "medium") return score >= 70 && score < 85;
      if (filter === "low") return score < 70;
      return true;
    });  

  const jobsBySource = filteredJobs.reduce<Record<string, typeof filteredJobs>>((acc, job) => {
    const key = job.source || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(job);
    return acc;
  }, {});
  const mixedJobs: typeof filteredJobs = [];
  const sourceKeys = Object.keys(jobsBySource);
  let remaining = filteredJobs.length;
  while (remaining > 0) {
    for (const key of sourceKeys) {
      const bucket = jobsBySource[key];
      if (bucket && bucket.length > 0) {
        mixedJobs.push(bucket.shift()!);
        remaining -= 1;
      }
    }
  }
  const displayJobs = mixedJobs;
  console.log('[JobMatches] filteredJobs computed:', {
    matchesCount: matches.length,
    filterValue: filter,
    filteredCount: filteredJobs.length
  });
  // When navigated from Dashboard with ?highlight=id, ensure the match is visible (clear filter if needed) then scroll to it
  useEffect(() => {
    if (!highlightId || loading || matches.length === 0) return;
    const matchExists = matches.some((m) => String(m.id) === highlightId);
    if (!matchExists) return;
    const inFiltered = filteredJobs.some((j) => j.id === highlightId);
    if (!inFiltered) setFilter("all");
  }, [highlightId, loading, matches.length, filteredJobs]);

  const highlightVisible = highlightId && filteredJobs.some((j) => j.id === highlightId);
  useEffect(() => {
    if (!highlightId || loading || !highlightVisible) return;
    const el = document.getElementById(`match-${highlightId}`);
    if (el) {
      const t = setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("highlight");
          return next;
        }, { replace: true });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [highlightId, loading, highlightVisible, setSearchParams]);


  const getMatchColor = (score: number) => {
    if (score >= 85) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 70) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return "text-green-600";
    if (prob >= 60) return "text-emerald-600";
    return "text-orange-600";
  };

  const handleMarkApplied = async (jobId: number, applied: boolean) => {
    setMarkingId(jobId);
    const prev = matches.find((m) => m.id === jobId);
    const prevAppliedAt = prev?.applied_at ?? null;
    if (applied) {
      setMatches((m) =>
        m.map((match) =>
          match.id === jobId ? { ...match, applied_at: new Date().toISOString() } : match
        )
      );
    } else {
      setMatches((m) =>
        m.map((match) => (match.id === jobId ? { ...match, applied_at: null } : match))
      );
    }
    try {
      await markJobMatchApplied(jobId, applied);
    } catch {
      if (mountedRef.current) {
        setMatches((m) =>
          m.map((match) =>
            match.id === jobId ? { ...match, applied_at: prevAppliedAt } : match
          )
        );
        toast.error("Failed to update applied status.");
      }
    } finally {
      if (mountedRef.current) setMarkingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header
        title="Job Matches"
        subtitle="AI-powered job recommendations based on your resume"
        showSearch={true}
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20 lg:pb-8">
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by match" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Matches</SelectItem>
                <SelectItem value="high">High Match (85%+)</SelectItem>
                <SelectItem value="medium">Medium Match (70-84%)</SelectItem>
                <SelectItem value="low">Low Match (&lt;70%)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredJobs.length} of {matches.length} matches
            </p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleScan} disabled={isScanning || requiresResume}>
                {isScanning ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TrendingUp className="w-4 h-4 mr-2" />
                )}
                {isScanning ? "Analyzing..." : "Load 2 More Jobs"}
              </Button>
            </TooltipTrigger>
            {requiresResume ? (
              <TooltipContent side="top">
                Upload your resume to start finding matches.
              </TooltipContent>
            ) : isScanning ? (
              <TooltipContent side="top">
                Searching and analyzing 2 jobs...
              </TooltipContent>
            ) : null}
          </Tooltip>
        </motion.div>

        {(loading && matches.length === 0) ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
            <p className="text-sm text-gray-500 mt-2">
              Loading matches...
            </p>
          </div>
        ) : isScanning && matches.length === 0 ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
            <p className="text-sm text-gray-500 mt-2">
              Searching for jobs...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {matches.length > 0 && filter !== "all" ? (
                  <>
                    <p>No jobs match your current filter.</p>
                    <p className="text-xs text-gray-400 mt-2">Try changing the filter or scan for more positions.</p>
                  </>
                ) : (
                  <p>
                    {hasAttemptedScan
                      ? "No jobs found yet. Try again later."
                      : "Click Find jobs to start searching for matches."}
                  </p>
                )}
              </div>
            ) : (
              displayJobs.map((job, index) => (
              <motion.div
                key={job.id}
                id={`match-${job.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 w-full sm:w-auto space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {job.title}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-600 dark:text-gray-400">
                              <span className="font-medium">{job.company}</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{job.location}</span>
                              </div>
                            </div>
                          </div>
                          {job.status === 'analyzing' ? (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 border flex-shrink-0 animate-pulse">
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Analyzing...
                            </Badge>
                          ) : (
                            <Badge className={`${getMatchColor(job.matchScore)} border flex-shrink-0`}>
                              {job.matchScore}% Match
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{job.salary || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Posted {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "—"}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs w-fit">
                            {job.source}
                          </Badge>
                        </div>
                        {job.status !== 'analyzing' && (
                          <>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Interview Probability
                                </span>
                                <span className={`text-sm font-semibold ${getProbabilityColor(job.interviewProbability)}`}>
                                  {job.interviewProbability}%
                                </span>
                              </div>
                              <Progress value={job.interviewProbability} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Matching Skills:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {job.missingSkills.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills to Add:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.missingSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                            )}
                          </>
                        )}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2">
                          {job.externalUrl && (
                            <Button className="bg-emerald-600 hover:bg-emerald-700 justify-center" asChild>
                              <a href={job.externalUrl} target="_blank" rel="noopener noreferrer">
                                Apply Now
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          )}
                          {job.appliedAt ? (
                            <>
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800 w-fit">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Applied
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={markingId === job.rawId || job.status === 'analyzing'}
                                onClick={() => handleMarkApplied(job.rawId, false)}
                              >
                                {markingId === job.rawId ? "Updating…" : "Undo"}
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={markingId === job.rawId || job.status === 'analyzing'}
                              onClick={() => handleMarkApplied(job.rawId, true)}
                            >
                              {markingId === job.rawId ? "Updating…" : "Mark as applied"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )))}
          </div>
        )}

        {!loading && !isScanning && filteredJobs.length === 0 && hasAttemptedScan && !requiresResume && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {matches.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No matches in this category</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try selecting &quot;All Matches&quot; or a different filter above.
                  </p>
                  <Button variant="outline" onClick={() => setFilter("all")}>
                    Show all matches
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No jobs found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We could not find matching jobs right now. Try again later or adjust your resume.
                  </p>
                  <Button onClick={handleScan} disabled={isScanning}>
                    {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                    Find jobs
                  </Button>
                </>
              )}
            </Card>
          </motion.div>
        )}
        {!loading && !isScanning && requiresResume && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Upload your resume first</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add your resume so we can find jobs that match your experience.
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
