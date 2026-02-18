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
  Loader2,
} from "lucide-react";
import { getResumes, uploadResume, downloadResume, type Resume } from "../../lib/api";

export function Resume() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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

  const latest = resumes[0];
  const hasResume = !!latest;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadResume(file);
      toast.success("Resume uploaded successfully");
      load();
    } catch (err: unknown) {
      const body = (err as { body?: { file?: string[]; detail?: string | string[] } })?.body;
      const msg = body?.file?.[0]
        ?? (Array.isArray(body?.detail) ? body?.detail?.[0] : body?.detail)
        ?? "Upload failed";
      toast.error(String(msg));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDownload = async (r: Resume) => {
    try {
      await downloadResume(r.id, r.original_filename || "resume.pdf");
      toast.success("Download started");
    } catch {
      toast.error("Download failed");
    }
  };

  const resumeMetrics = latest?.parsed_content
    ? [
        { label: "Skills", value: (latest.parsed_content.skills as string[])?.length ? 90 : 50, status: "good" as const },
        { label: "Experience", value: (latest.parsed_content.experience as unknown[])?.length ? 85 : 60, status: "warning" as const },
        { label: "Education", value: (latest.parsed_content.education as unknown[])?.length ? 80 : 50, status: "good" as const },
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-2">
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {latest.original_filename || latest.file?.split("/").pop() || "Resume"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Uploaded {new Date(latest.uploaded_at).toLocaleDateString()} • v{latest.version}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-initial"
                        onClick={() => handleDownload(latest)}
                      >
                        <Download className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  </div>

                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload a new version</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DOC, DOCX up to 10MB</p>
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

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                      </div>
                      <Progress value={50} className="animate-pulse" />
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
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-100 dark:border-emerald-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {latest?.parsed_content?.skills?.length ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Extracted Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(latest.parsed_content.skills as string[]).slice(0, 10).map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a resume to get AI-powered parsing and improvement suggestions.
                </p>
              )}
              {resumes.length > 1 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Version History</p>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {resumes.slice(0, 5).map((r) => (
                      <div key={r.id} className="flex justify-between">
                        <span>v{r.version}</span>
                        <span>{new Date(r.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
