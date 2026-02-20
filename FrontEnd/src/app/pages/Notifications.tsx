import { Header } from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { NotificationDetailModal } from "../components/NotificationDetailModal";
import { 
  Bell,
  CheckCheck,
  Briefcase,
  FileText,
  Lightbulb,
  Settings,
  TrendingUp,
  AlertCircle,
  Clock
} from "lucide-react";
import { useState } from "react";
import { cn } from "../components/ui/utils";
import { useNotification, type Notification } from "../../lib/notification-context";

type NotificationType = "match" | "resume" | "insight" | "system" | "achievement";

const notificationIcons: Record<NotificationType, any> = {
  match: Briefcase,
  resume: FileText,
  insight: Lightbulb,
  system: Settings,
  achievement: TrendingUp,
};

const notificationColors: Record<NotificationType, string> = {
  match: "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
  resume: "from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
  insight: "from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800",
  system: "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700",
  achievement: "from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
};

const notificationIconColors: Record<NotificationType, string> = {
  match: "text-blue-600 dark:text-blue-400",
  resume: "text-purple-600 dark:text-purple-400",
  insight: "text-amber-600 dark:text-amber-400",
  system: "text-gray-600 dark:text-gray-400",
  achievement: "text-green-600 dark:text-green-400",
};

export function Notifications() {
  const { notifications, markAsRead, markAllAsRead, clearReadNotifications } = useNotification();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    // Mark as read when opening details
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const handleClearReadNotifications = () => {
    clearReadNotifications();
    setFilter("all"); // Reset to all view
  };

  const readCount = notifications.length - unreadCount;
  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => !n.read);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header 
        title="Notifications" 
        subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
      />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              All Notifications
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
              className={filter === "unread" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
            >
              Unread ({unreadCount})
            </Button>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            )}
            {readCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearReadNotifications}
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Clear Read ({readCount})
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  {filter === "unread" 
                    ? "You're all caught up! No unread notifications at the moment."
                    : "You don't have any notifications yet. We'll notify you about job matches and updates."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              
              return (
                <Card 
                  key={notification.id}
                  className={cn(
                    "transition-all duration-200 hover:shadow-md cursor-pointer border-l-4",
                    notification.read 
                      ? "bg-white dark:bg-gray-900 border-l-transparent" 
                      : "bg-blue-50/50 dark:bg-blue-950/20 border-l-blue-600 dark:border-l-blue-400",
                    notification.priority === "high" && !notification.read && "border-l-red-600 dark:border-l-red-400"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                        notificationColors[notification.type]
                      )}>
                        <Icon className={cn("w-6 h-6", notificationIconColors[notification.type])} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={cn(
                            "font-semibold text-gray-900 dark:text-gray-100",
                            !notification.read && "font-bold"
                          )}>
                            {notification.title}
                            {notification.priority === "high" && (
                              <span className="ml-2 inline-flex items-center">
                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </span>
                            )}
                          </h3>
                          {!notification.read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
