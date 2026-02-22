import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  Loader2,
  Trash2,
} from "lucide-react";
import { getResumes, uploadResume, getResumeReview, deleteResume, setResumePrimary, type Resume, type MatchAnalysisStatus, type ResumeReview } from "../../lib/api";
import { useScan } from "../../lib/scan-context";

export function Resume() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<number | null>(null);
  const [review, setReview] = useState<ResumeReview | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    getResumes()
      .then(setResumes)
      .catch(() => toast.error("Failed to load resumes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const current = resumes.find((r) => r.is_primary) ?? resumes[0];
  const hasResume = resumes.length > 0;

  const resumeDisplayName = (r: Resume) =>
    r.original_filename || r.file?.split("/").pop() || "Resume";

  const { setScanning } = useScan();

  const loadReview = async (resumeId: number) => {
    setReviewLoading(true);
    setReviewError(null);
    try {
      const data = await getResumeReview(resumeId);
      setReview(data);
      return true;
    } catch {
      setReviewError("Failed to load resume review");
      setReview(null);
      return false;
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (current?.id) {
      loadReview(current.id);
    } else {
      setReview(null);
    }
  }, [current?.id]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const resp = (await uploadResume(file, (p) => setUploadProgress(p))) as Resume & { match_analysis?: MatchAnalysisStatus };
      setUploadProgress(100);
      toast.success("Resume uploaded successfully");
      try {
        localStorage.setItem("hiresense:insights-pending", "1");
      } catch {}
      // If backend started async match analysis, set scanning so JobMatches polls
      if (resp.match_analysis?.started) {
        if (resp.match_analysis.async) {
          setScanning(true);
          window.dispatchEvent(new CustomEvent("hiresense:scan-start"));
          try {
            localStorage.setItem("hiresense:scan-pending", Date.now().toString());
          } catch {}
          toast.info("Match analysis started — scanning for jobs and regenerating insights...");
        } else {
          setScanning(false);
          toast.success("Match analysis completed");
        }
      }
      load();
    } catch (err: unknown) {
      const body = (err as { body?: { file?: string[]; detail?: string | string[] } })?.body;
      const msg = body?.file?.[0]
        ?? (Array.isArray(body?.detail) ? body?.detail?.[0] : body?.detail)
        ?? "Upload failed";
      toast.error(String(msg));
    } finally {
      setUploading(false);
      // reset progress after a short delay so user sees full bar
      setTimeout(() => setUploadProgress(0), 800);
      e.target.value = "";
    }
  };

  const handleReviewRefresh = async (r: Resume) => {
    const ok = await loadReview(r.id);
    if (ok) {
      toast.success("Resume review updated");
    } else {
      toast.error("Failed to load resume review");
    }
  };

  const handleRemove = async (r: Resume, label: string) => {
    if (!window.confirm(`Remove ${label}? You can upload a new file anytime.`)) return;
    setDeletingId(r.id);
    try {
      await deleteResume(r.id);
      toast.success("Resume removed");
      
      // Reload data and notify if all resumes are now gone
      setLoading(true);
      try {
        const updated = await getResumes();
        setResumes(updated);
        
        // If there are no resumes left, dispatch event for Dashboard/Notifications to refresh
        if (updated.length === 0) {
          window.dispatchEvent(new CustomEvent("hiresense:resumes-cleared"));
          console.log("📢 Dispatched hiresense:resumes-cleared - all resumes deleted");
        }
      } catch {
        toast.error("Failed to reload resumes");
      } finally {
        setLoading(false);
      }
    } catch {
      toast.error("Failed to remove resume");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrimary = async (r: Resume) => {
    setSettingPrimaryId(r.id);
    try {
      const resp = await setResumePrimary(r.id) as Resume & { match_analysis?: MatchAnalysisStatus };
      toast.success(`"${resumeDisplayName(r)}" is now used for job matches and insights`);
      // Optimistically update local state: mark this resume current without reloading from server
      setResumes((prev) => prev.map((x) => ({ ...x, is_primary: x.id === r.id })));
      if (resp.match_analysis?.started) {
        if (resp.match_analysis.async) {
          setScanning(true);
          window.dispatchEvent(new CustomEvent("hiresense:scan-start"));
          try {
            localStorage.setItem("hiresense:scan-pending", Date.now().toString());
          } catch {}
          toast.info("Match analysis started — scanning for jobs and regenerating insights...");
        } else {
          setScanning(false);
          toast.success("Match analysis completed");
        }
      }
    } catch {
      toast.error("Failed to set as current");
    } finally {
      setSettingPrimaryId(null);
    }
  };

  const resumeMetrics = current?.parsed_content
    ? [
        { label: "Skills", value: (current.parsed_content.skills as string[])?.length ? 90 : 50, status: "good" as const },
        { label: "Experience", value: (current.parsed_content.experience as unknown[])?.length ? 85 : 60, status: (current.parsed_content.experience as unknown[])?.length ? "good" as const : "warning" as const },
        { label: "Education", value: (current.parsed_content.education as unknown[])?.length ? 80 : 50, status: "good" as const },
      ]
    : [
        { label: "ATS Compatibility", value: 92, status: "good" as const },
        { label: "Keyword Match", value: 78, status: "warning" as const },
        { label: "Format Quality", value: 95, status: "good" as const },
      ];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header
        title="Resume"
        subtitle="Upload and optimize your resume for better job matches"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20 lg:pb-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileSelect}
              />

              {loading ? (
                <div className="py-8 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : hasResume ? (
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Replace or add a new version</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DOC, DOCX up to 10MB.</p>
                    <Button
                      className="mt-4"
                      variant="outline"
                      disabled={uploading}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Choose File
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current resume</h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 rounded">
                        <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {resumeDisplayName(current)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Uploaded {new Date(current.uploaded_at).toLocaleDateString()} · Version {current.version} · used for job matches and insights
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-initial"
                          onClick={() => handleReviewRefresh(current)}
                        >
                          <Sparkles className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Review</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-initial"
                          disabled
                          title="Download feature coming soon"
                        >
                          <Download className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-initial text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                          onClick={() => handleRemove(current, resumeDisplayName(current))}
                          disabled={deletingId === current.id}
                        >
                          {deletingId === current.id ? (
                            <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 sm:mr-2" />
                          )}
                          <span className="hidden sm:inline">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                        <span className="text-sm text-gray-500">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Upload Your Resume</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Drag and drop or click to browse
                  </p>
                  <Button disabled={uploading}>
                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    Choose File
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">PDF, DOC, DOCX (Max 10MB)</p>
                </div>
              )}

              {hasResume && (
                <>
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Resume Analysis</h3>
                    {resumeMetrics.map((metric) => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{metric.value}%</span>
                            {metric.status === "good" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                        </div>
                        <Progress value={metric.value} className={metric.status === "good" ? "" : "bg-orange-100"} />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Resume Review</h3>
                      {current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewRefresh(current)}
                          disabled={reviewLoading}
                        >
                          {reviewLoading ? <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 sm:mr-2" />}
                          <span className="hidden sm:inline">Refresh</span>
                        </Button>
                      )}
                    </div>
                    {reviewLoading ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading review...
                      </div>
                    ) : reviewError ? (
                      <p className="text-sm text-red-600 dark:text-red-400">{reviewError}</p>
                    ) : review ? (
                      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        {review.strengths.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">Strengths</p>
                            <ul className="mt-1 space-y-1">
                              {review.strengths.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.gaps.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-400">Gaps</p>
                            <ul className="mt-1 space-y-1">
                              {review.gaps.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.suggestions.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase text-blue-700 dark:text-blue-400">Suggestions</p>
                            <ul className="mt-1 space-y-1">
                              {review.suggestions.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Upload a resume to receive an instant review.
                      </p>
                    )}
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Your resumes ({resumes.length})
                    </h3>
                    <div className="space-y-3">
                      {resumes.map((r) => (
                        <div
                          key={r.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg"
                        >
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 rounded">
                            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {resumeDisplayName(r)}
                              </h3>
                              {r.is_primary && (
                                <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Uploaded {new Date(r.uploaded_at).toLocaleDateString()} · Version {r.version}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            {resumes.length > 1 && !r.is_primary && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-initial border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                                onClick={() => handleSetPrimary(r)}
                                disabled={settingPrimaryId === r.id}
                              >
                                {settingPrimaryId === r.id ? (
                                  <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
                                ) : null}
                                <span className="hidden sm:inline">Set as current</span>
                                <span className="sm:hidden">Current</span>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 sm:flex-initial"
                              onClick={() => handleReviewRefresh(r)}
                            >
                              <Sparkles className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Review</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 sm:flex-initial text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                              onClick={() => handleRemove(r, resumeDisplayName(r))}
                              disabled={deletingId === r.id}
                            >
                              {deletingId === r.id ? (
                                <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 sm:mr-2" />
                              )}
                              <span className="hidden sm:inline">Remove</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
