import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Globe, Plus, Trash2, Bell, Mail, User, Save, Loader2 } from "lucide-react";
import {
  getJobSites,
  updateJobSite,
  createJobSite,
  deleteJobSite,
  type JobSite,
} from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export function Settings() {
  const { user } = useAuth();
  const [jobSites, setJobSites] = useState<JobSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getJobSites()
      .then(setJobSites)
      .catch(() => toast.error("Failed to load job sites"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSite = async (site: JobSite) => {
    try {
      const updated = await updateJobSite(site.id, { enabled: !site.enabled });
      setJobSites((s) => s.map((x) => (x.id === site.id ? updated : x)));
      toast.success("Updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const removeSite = async (site: JobSite) => {
    if (site.is_builtin) return;
    try {
      await deleteJobSite(site.id);
      setJobSites((s) => s.filter((x) => x.id !== site.id));
      toast.success("Site removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const addSite = async () => {
    const url = newSiteUrl.trim();
    if (!url) return;
    try {
      let name = "";
      try {
        name = new URL(url).hostname.replace("www.", "");
      } catch {
        name = "Custom";
      }
      const created = await createJobSite({ name, url });
      setJobSites((s) => [created, ...s]);
      setNewSiteUrl("");
      toast.success("Site added");
    } catch (err: unknown) {
      const msg = (err as { body?: { detail?: string } })?.body?.detail ?? "Failed to add site";
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header
        title="Settings"
        subtitle="Manage your account, notifications, and job site preferences"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Job Posting Websites
              </CardTitle>
              <CardDescription>
                Enable or disable job sources. Built-in sources can be toggled; add custom RSS feed URLs below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="py-8 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {jobSites.map((site) => (
                      <div
                        key={site.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{site.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{site.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={site.enabled}
                            onCheckedChange={() => toggleSite(site)}
                          />
                          {!site.is_builtin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSite(site)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Label htmlFor="new-site" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Add Custom Job Board
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="new-site"
                        placeholder="https://example.com/jobs"
                        value={newSiteUrl}
                        onChange={(e) => setNewSiteUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addSite} disabled={saving}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Site
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Enter the URL of any job board (RSS feed URL recommended)
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about new job matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get daily summaries of new matches</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">High Match Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Instant alerts for 85%+ matches</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Weekly Reports</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Summary of activity and insights</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={user ? [user.first_name, user.last_name].filter(Boolean).join(" ") || "—" : ""}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email ?? ""}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
