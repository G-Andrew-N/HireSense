import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { 
  Globe, 
  Plus,
  Trash2,
  Bell,
  Mail,
  User,
  Save
} from "lucide-react";
import { mockJobSites } from "../data/mockData";
import { useState } from "react";

export function Settings() {
  const [jobSites, setJobSites] = useState(mockJobSites);
  const [newSiteUrl, setNewSiteUrl] = useState("");

  const toggleSite = (id: string) => {
    setJobSites(sites => 
      sites.map(site => 
        site.id === id ? { ...site, enabled: !site.enabled } : site
      )
    );
  };

  const removeSite = (id: string) => {
    setJobSites(sites => sites.filter(site => site.id !== id));
  };

  const addSite = () => {
    if (newSiteUrl.trim()) {
      const newSite = {
        id: Date.now().toString(),
        name: new URL(newSiteUrl).hostname.replace('www.', ''),
        enabled: true,
        url: newSiteUrl,
      };
      setJobSites([...jobSites, newSite]);
      setNewSiteUrl("");
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
          {/* Main Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Job Posting Websites
              </CardTitle>
              <CardDescription>
                Select which job boards HireSense should monitor for matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Default Sites */}
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">{site.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch 
                        checked={site.enabled}
                        onCheckedChange={() => toggleSite(site.id)}
                      />
                      {!["1", "2", "3"].includes(site.id) && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeSite(site.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Site */}
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
                  <Button onClick={addSite}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Site
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Enter the URL of any job board you'd like HireSense to monitor
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
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

          {/* Profile Settings */}
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
                  <Input id="name" defaultValue="Demo User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="demo@hiresense.ai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Preferred Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save All Changes - Sticky Footer */}
        <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 sm:p-6 mt-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Unsaved Changes
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Save your settings across all categories
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-initial"
              >
                Discard
              </Button>
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex-1 sm:flex-initial shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}