import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Globe, Plus, Trash2, Bell, Mail, User, Save, Loader2, Camera, Pencil } from "lucide-react";
import {
  getJobSites,
  updateJobSite,
  createJobSite,
  deleteJobSite,
  updateProfile,
  type JobSite,
} from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export function Settings() {
  const { user, setUser } = useAuth();
  const [jobSites, setJobSites] = useState<JobSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
    }
  }, [user]);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    try {
      const updated = await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        ...(avatarFile ? { avatar: avatarFile } : {}),
      });
      setUser(updated);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      toast.success("Profile updated");
    } catch (err: unknown) {
      const msg = (err as { body?: { detail?: string } })?.body?.detail ?? "Failed to update profile";
      toast.error(msg);
    } finally {
      setProfileSaving(false);
    }
  };

  const profileDirty =
    firstName !== (user?.first_name ?? "") ||
    lastName !== (user?.last_name ?? "") ||
    avatarFile !== null;

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header
        title="Settings"
        subtitle="Manage your account, notifications, and job site preferences"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20 lg:pb-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
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
              <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Pencil className="w-4 h-4" />
                Edit your name and profile photo below. Click Save to apply changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  <label className="relative block cursor-pointer group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-2 ring-transparent group-hover:ring-emerald-400 transition-all">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </span>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {avatarFile ? "New photo selected" : "Click to change photo"}
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email ?? ""}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed here.</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={profileSaving || !profileDirty}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {profileSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
