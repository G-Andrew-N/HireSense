import { X, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

interface NotificationDetailModalProps {
  notification: {
    id: string;
    type: "match" | "resume" | "insight" | "system" | "achievement";
    title: string;
    message: string;
    time: string;
    read: boolean;
    priority?: "high" | "normal";
    details?: string; // Extended content
  };
  onClose: () => void;
}

const notificationIcons: Record<string, any> = {
  match: "Briefcase",
  resume: "FileText",
  insight: "Lightbulb",
  system: "Settings",
  achievement: "TrendingUp",
};

const notificationColors: Record<string, string> = {
  match: "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
  resume: "from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
  insight: "from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800",
  system: "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700",
  achievement: "from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
};

const notificationIconColors: Record<string, string> = {
  match: "text-blue-600 dark:text-blue-400",
  resume: "text-purple-600 dark:text-purple-400",
  insight: "text-amber-600 dark:text-amber-400",
  system: "text-gray-600 dark:text-gray-400",
  achievement: "text-green-600 dark:text-green-400",
};

export function NotificationDetailModal({ 
  notification, 
  onClose
}: NotificationDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={cn(
          "sticky top-0 bg-gradient-to-r p-6 text-white flex items-center justify-between border-b",
          notification.type === "match" && "from-blue-600 to-blue-700",
          notification.type === "resume" && "from-purple-600 to-purple-700",
          notification.type === "insight" && "from-amber-600 to-amber-700",
          notification.type === "system" && "from-gray-600 to-gray-700",
          notification.type === "achievement" && "from-green-600 to-green-700"
        )}>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-1 rounded transition"
              aria-label="Close"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold truncate">{notification.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition flex-shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meta Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                {notification.type}
              </span>
              {notification.priority === "high" && (
                <span className="px-2.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full">
                  High Priority
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {notification.time}
            </span>
          </div>

          {/* Main Message */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Detailed Information */}
          {notification.details && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Details</h3>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {notification.details}
              </div>
            </div>
          )}

          {/* Related Actions */}
          <div className="border-t pt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
