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
  Eye,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export function Resume() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasResume, setHasResume] = useState(true);

  const handleFileUpload = () => {
    // Simulate upload
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setHasResume(true);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const resumeMetrics = [
    { label: "ATS Compatibility", value: 92, status: "good" },
    { label: "Keyword Match", value: 78, status: "warning" },
    { label: "Format Quality", value: 95, status: "good" },
    { label: "Completeness", value: 85, status: "good" },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header 
        title="Resume" 
        subtitle="Upload and optimize your resume for better job matches"
      />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Upload Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Resume Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {hasResume ? (
                <div className="space-y-4">
                  {/* Current Resume */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">John_Doe_Resume_2024.pdf</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Uploaded on Feb 14, 2024 • 245 KB</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                        <Eye className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                        <Download className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  </div>

                  {/* Upload New Version */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload a new version</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                    <Button 
                      className="mt-4" 
                      variant="outline"
                      onClick={handleFileUpload}
                    >
                      Choose File
                    </Button>
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                        <span className="font-medium dark:text-gray-200">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Drag and drop your resume here, or click to browse
                  </p>
                  <Button onClick={handleFileUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              )}

              {/* Resume Metrics */}
              {hasResume && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-900">Resume Analysis</h3>
                  {resumeMetrics.map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{metric.value}%</span>
                          {metric.status === "good" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                      </div>
                      <Progress 
                        value={metric.value} 
                        className={metric.status === "good" ? "" : "bg-orange-100"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-100 dark:border-emerald-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Strong technical skills section with relevant keywords
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      ATS-friendly formatting detected
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Missing quantifiable achievements in experience section
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Add GraphQL and Kubernetes to improve match rate by 23%
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Get Detailed Analysis
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resume Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Resume Optimization Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Use Action Verbs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start bullet points with strong action verbs like "Developed", "Implemented", "Led"
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-500">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Quantify Results</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Include numbers and percentages to demonstrate impact and achievements
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Tailor Keywords</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Match your resume keywords to the job descriptions you're targeting
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}