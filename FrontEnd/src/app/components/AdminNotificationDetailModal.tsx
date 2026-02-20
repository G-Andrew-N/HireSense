import { X, ArrowLeft, Clock, User, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

interface AdminNotificationDetailModalProps {
  notification: {
    id: number;
    notification_title: string;
    notification_message: string;
    notification_type: string;
    sent_by_email: string;
    is_read: boolean;
    read_at: string | null;
    notification_sent_at: string;
    created_at: string;
  };
  onClose: () => void;
}

const adminNotificationTypeColors: Record<string, string> = {
  maintenance: "from-red-600 to-red-700",
  important: "from-orange-600 to-orange-700",
  info: "from-blue-600 to-blue-700",
  alert: "from-yellow-600 to-yellow-700",
  warning: "from-purple-600 to-purple-700",
};

const adminNotificationTypeBgColors: Record<string, string> = {
  maintenance: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  important: "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  info: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  alert: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  warning: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
};

const adminNotificationTypeLabels: Record<string, string> = {
  maintenance: "Maintenance",
  important: "Important",
  info: "Information",
  alert: "Alert",
  warning: "Warning",
};

export function AdminNotificationDetailModal({
  notification,
  onClose
}: AdminNotificationDetailModalProps) {
  const bgGradient = adminNotificationTypeColors[notification.notification_type] || adminNotificationTypeColors.info;
  const badgeBg = adminNotificationTypeBgColors[notification.notification_type] || adminNotificationTypeBgColors.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={cn(
          "sticky top-0 bg-gradient-to-r p-6 text-white flex items-center justify-between border-b",
          bgGradient
        )}>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-1 rounded transition"
              aria-label="Close"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold truncate">{notification.notification_title}</h2>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={cn("px-3 py-1 text-xs font-medium rounded-full", badgeBg)}>
                {adminNotificationTypeLabels[notification.notification_type] || notification.notification_type}
              </span>
              {!notification.is_read && (
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(notification.created_at).toLocaleString()}
            </span>
          </div>

          {/* Main Message */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
              {notification.notification_message}
            </p>
          </div>

          {/* Sender Information */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <User className="w-4 h-4" />
              Sent By
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Admin</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{notification.sent_by_email}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sent</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {new Date(notification.notification_sent_at).toLocaleString()}
                </span>
              </div>
              {notification.is_read && notification.read_at && (
                <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="text-sm text-green-700 dark:text-green-400">Read</span>
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">
                    {new Date(notification.read_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
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
