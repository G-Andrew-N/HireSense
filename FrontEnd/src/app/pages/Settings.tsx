import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Bell, User, Save, Loader2, Camera, Pencil } from "lucide-react";
import { updateProfile } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export function Settings() {
  const { user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // Notification preferences
  const [highMatchAlerts, setHighMatchAlerts] = useState(user?.high_match_alerts ?? true);
  const [weeklyReports, setWeeklyReports] = useState(user?.weekly_reports ?? false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
      setHighMatchAlerts(user.high_match_alerts ?? true);
      setWeeklyReports(user.weekly_reports ?? false);
    }
  }, [user]);

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

  const handleSaveNotifications = async () => {
    if (!user) return;
    setNotificationSaving(true);
    try {
      const updated = await updateProfile({
        high_match_alerts: highMatchAlerts,
        weekly_reports: weeklyReports,
      });
      setUser(updated);
      toast.success("Notification preferences saved");
    } catch (err: unknown) {
      const msg = (err as { body?: { detail?: string } })?.body?.detail ?? "Failed to save notification preferences";
      toast.error(msg);
    } finally {
      setNotificationSaving(false);
    }
  };

  const profileDirty =
    firstName !== (user?.first_name ?? "") ||
    lastName !== (user?.last_name ?? "") ||
    avatarFile !== null;

  const notificationsDirty =
    highMatchAlerts !== (user?.high_match_alerts ?? true) ||
    weeklyReports !== (user?.weekly_reports ?? false);

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
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about new job matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">High Match Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Instant alerts for 85%+ matches</p>
                  </div>
                </div>
                <Switch checked={highMatchAlerts} onCheckedChange={setHighMatchAlerts} />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Weekly Reports</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Summary of activity and insights</p>
                  </div>
                </div>
                <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
              </div>
              {notificationsDirty && (
                <Button
                  onClick={handleSaveNotifications}
                  disabled={notificationSaving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {notificationSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save preferences
                </Button>
              )}
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
