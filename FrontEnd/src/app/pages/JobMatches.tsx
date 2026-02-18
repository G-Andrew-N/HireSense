import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Header } from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
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
  triggerJobScan,
  triggerMatchAnalysisChunk,
  type JobMatch,
} from "../../lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { motion } from "motion/react";

function toDisplay(j: JobMatch) {
  return {
    id: String(j.id),
    title: j.title,
    company: j.company,
    location: j.location,
    matchScore: j.match_score,
    interviewProbability: j.interview_probability,
    salary: j.salary,
    postedDate: j.posted_date ?? "",
    source: j.source,
    externalUrl: j.external_url,
    skills: j.skills ?? [],
    missingSkills: j.missing_skills ?? [],
  };
}

export function JobMatches() {
  const { isScanning, setScanning } = useScan();
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const mountedRef = useRef(true);

  const load = useCallback(() => {
    setLoading(true);
    return getJobMatches()
      .then((data) => { if (mountedRef.current) setMatches(data); })
      .catch(() => toast.error("Failed to load matches"))
      .finally(() => { if (mountedRef.current) setLoading(false); });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  // When returning to this page while scan is in progress, poll for new matches
  useEffect(() => {
    if (!isScanning) return;
    const id = setInterval(() => {
      load();
    }, 3000);
    return () => clearInterval(id);
  }, [isScanning, load]);

  const filteredJobs = matches
    .map(toDisplay)
    .filter((job) => {
      if (filter === "high") return job.matchScore >= 85;
      if (filter === "medium") return job.matchScore >= 70 && job.matchScore < 85;
      if (filter === "low") return job.matchScore < 70;
      return true;
    });

  const handleScan = async () => {
    setScanning(true);
    toast.info("Job scan started. Jobs will appear as they’re found.");
    try {
      await triggerJobScan(true);
      let totalCreated = 0;
      let hasMore = true;
      while (hasMore && mountedRef.current) {
        const { matches: newMatches, has_more } = await triggerMatchAnalysisChunk(3);
        if (newMatches.length > 0 && mountedRef.current) {
          setMatches((prev) => [...prev, ...newMatches]);
          totalCreated += newMatches.length;
        }
        hasMore = has_more;
      }
      toast.success(totalCreated > 0 ? `Found ${totalCreated} new job matches!` : "Scan complete.");
    } catch (err: unknown) {
      const msg = (err as { body?: { detail?: string } })?.body?.detail ?? "Scan failed";
      toast.error(msg);
    } finally {
      setScanning(false);
    }
  };

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

          <Button onClick={handleScan} disabled={isScanning}>
            {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
            Scan for New Jobs
          </Button>
        </motion.div>

        {(loading || isScanning) ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
            <p className="text-sm text-gray-500 mt-2">
              {isScanning ? "Scanning for jobs..." : "Loading matches..."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
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
                          <Badge className={`${getMatchColor(job.matchScore)} border flex-shrink-0`}>
                            {job.matchScore}% Match
                          </Badge>
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
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2">
                          {job.externalUrl && (
                            <Button className="bg-emerald-600 hover:bg-emerald-700 justify-center" asChild>
                              <a href={job.externalUrl} target="_blank" rel="noopener noreferrer">
                                Apply Now
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !isScanning && filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No matches found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload your resume and run a job scan to get matches.
              </p>
              <Button onClick={handleScan} disabled={isScanning}>
                {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                Scan for Jobs
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
