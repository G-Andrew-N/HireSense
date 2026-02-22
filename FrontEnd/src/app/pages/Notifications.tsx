import { Header } from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { NotificationDetailModal } from "../components/NotificationDetailModal";
import { AdminNotificationDetailModal } from "../components/AdminNotificationDetailModal";
import { 
  Bell,
  CheckCheck,
  Briefcase,
  FileText,
  Lightbulb,
  Settings,
  TrendingUp,
  AlertCircle,
  Clock,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../components/ui/utils";
import { useNotification, type Notification } from "../../lib/notification-context";
import { apiRequest } from "@/lib/api";

type NotificationType = "match" | "resume" | "insight" | "system" | "achievement";

interface AdminNotification {
  id: number;
  notification: number;
  notification_title: string;
  notification_message: string;
  notification_type: string;
  sent_by_email: string;
  is_read: boolean;
  read_at: string | null;
  notification_sent_at: string;
  created_at: string;
}

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
  system: "from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
  achievement: "from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
};

const notificationIconColors: Record<NotificationType, string> = {
  match: "text-blue-600 dark:text-blue-400",
  resume: "text-purple-600 dark:text-purple-400",
  insight: "text-amber-600 dark:text-amber-400",
  system: "text-green-600 dark:text-green-400",
  achievement: "text-green-600 dark:text-green-400",
};

const adminNotificationTypeColors: Record<string, string> = {
  maintenance: "from-red-100 to-red-200 dark:from-red-900 dark:to-red-800",
  important: "from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800",
  info: "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
  alert: "from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800",
  warning: "from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
};

const adminNotificationTypeIconColors: Record<string, string> = {
  maintenance: "text-red-600 dark:text-red-400",
  important: "text-orange-600 dark:text-orange-400",
  info: "text-blue-600 dark:text-blue-400",
  alert: "text-yellow-600 dark:text-yellow-400",
  warning: "text-purple-600 dark:text-purple-400",
};

const adminNotificationTypeLabels: Record<string, string> = {
  maintenance: "Maintenance",
  important: "Important",
  info: "Information",
  alert: "Alert",
  warning: "Warning",
};

export function Notifications() {
  const { notifications, markAsRead, markAllAsRead, clearReadNotifications } = useNotification();
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "system">("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedAdminNotification, setSelectedAdminNotification] = useState<AdminNotification | null>(null);

  // Calculate unread counts for both app and system notifications
  const appUnreadCount = notifications.filter(n => !n.read).length;
  const adminUnreadCount = adminNotifications.filter(n => !n.is_read).length;
  const totalUnreadCount = appUnreadCount + adminUnreadCount;

  // Fetch admin notifications
  const fetchAdminNotifications = async () => {
    try {
      setLoadingAdmin(true);
      const response = await apiRequest<AdminNotification[] | { results: AdminNotification[] }>('/notifications/');
      const notifications = Array.isArray(response) ? response : (response.results || []);
      setAdminNotifications(notifications);
    } catch (error) {
      console.error('Failed to fetch admin notifications:', error);
    } finally {
      setLoadingAdmin(false);
    }
  };
  
  useEffect(() => {
    fetchAdminNotifications();
  }, []);

  // Listen for resume deletion event and refresh admin notifications
  useEffect(() => {
    const handleResumeCleared = () => {
      console.log("📢 Notifications page received hiresense:resumes-cleared - refreshing data");
      fetchAdminNotifications();
    };

    window.addEventListener("hiresense:resumes-cleared", handleResumeCleared);
    return () => window.removeEventListener("hiresense:resumes-cleared", handleResumeCleared);
  }, []);



  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    // Mark as read when opening details
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleAdminNotificationClick = async (notification: AdminNotification) => {
    setSelectedAdminNotification(notification);
    // Mark as read when opening details
    if (!notification.is_read) {
      try {
        await apiRequest(`/notifications/${notification.id}/mark_as_read/`, {
          method: 'POST',
        });
        
        // Update local state
        setAdminNotifications(adminNotifications.map(n =>
          n.id === notification.id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        ));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const handleMarkAdminAsRead = async (adminNotification: AdminNotification) => {
    if (!adminNotification.is_read) {
      try {
        await apiRequest(`/notifications/${adminNotification.id}/mark_as_read/`, {
          method: 'POST',
        });
        
        // Update local state
        setAdminNotifications(adminNotifications.map(n =>
          n.id === adminNotification.id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        ));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const handleMarkAllAdminAsRead = async () => {
    try {
      await apiRequest('/notifications/mark_all_as_read/', {
        method: 'POST',
      });
      
      setAdminNotifications(adminNotifications.map(n => ({
        ...n,
        is_read: true,
        read_at: new Date().toISOString()
      })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const handleCloseAdminModal = () => {
    setSelectedAdminNotification(null);
  };

  const handleClearReadNotifications = () => {
    clearReadNotifications();
    setFilter("all"); // Reset to all view
  };

  const appReadCount = notifications.length - appUnreadCount;
  const adminReadCount = adminNotifications.length - adminUnreadCount;
  
  let filteredNotifications = notifications;
  let filteredAdminNotifications = adminNotifications;
  
  if (filter === "unread") {
    filteredNotifications = notifications.filter(n => !n.read);
    filteredAdminNotifications = adminNotifications.filter(n => !n.is_read);
  } else if (filter === "system") {
    filteredNotifications = [];
    // adminNotifications shown as-is
  } else {
    // 'all' tab shows both
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header 
        title="Notifications" 
        subtitle={`You have ${totalUnreadCount} unread notification${totalUnreadCount !== 1 ? 's' : ''}`}
      />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
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
              Unread ({totalUnreadCount})
            </Button>
            <Button
              variant={filter === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("system")}
              className={filter === "system" ? "bg-gradient-to-r from-green-600 to-emerald-600" : ""}
            >
              <Shield className="w-4 h-4 mr-2" />
              System (
              {adminUnreadCount > 0 ? adminUnreadCount : adminNotifications.length})
            </Button>
          </div>

          <div className="flex gap-2">
            {(filter === "all" && (appUnreadCount > 0 || adminUnreadCount > 0) || 
              filter === "unread" && totalUnreadCount > 0 ||
              filter === "system" && adminUnreadCount > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  if (filter === "system") {
                    await handleMarkAllAdminAsRead();
                  } else if (filter === "all") {
                    // Mark both app and admin notifications as read
                    if (appUnreadCount > 0) markAllAsRead();
                    if (adminUnreadCount > 0) await handleMarkAllAdminAsRead();
                  } else {
                    // Unread filter - mark both
                    if (appUnreadCount > 0) markAllAsRead();
                    if (adminUnreadCount > 0) await handleMarkAllAdminAsRead();
                  }
                }}
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        <>
          {/* System Notifications Section */}
          {(filter === "all" || filter === "system" || (filter === "unread" && filteredAdminNotifications.length > 0)) && adminNotifications.length > 0 && (
            <div className="mb-8">
              {(filter === "all" || filter === "unread") && (
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  System Notifications
                </h2>
              )}
              
              <div className="space-y-3">
                {filteredAdminNotifications.map((notification) => (
                    <Card 
                      key={notification.id}
                      className={cn(
                        "transition-all duration-200 hover:shadow-md cursor-pointer border-l-4",
                        notification.is_read 
                          ? "bg-white dark:bg-gray-900 border-l-transparent" 
                          : "bg-green-50/50 dark:bg-green-950/20 border-l-green-600 dark:border-l-green-400"
                      )}
                      onClick={() => handleAdminNotificationClick(notification)}
                    >
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className={cn(
                            "flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                            adminNotificationTypeColors[notification.notification_type] || adminNotificationTypeColors.info
                          )}>
                            <Shield className={cn("w-6 h-6", adminNotificationTypeIconColors[notification.notification_type] || adminNotificationTypeIconColors.info)} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex-1">
                                <h3 className={cn(
                                  "font-semibold text-gray-900 dark:text-gray-100",
                                  !notification.is_read && "font-bold"
                                )}>
                                  {notification.notification_title}
                                </h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {adminNotificationTypeLabels[notification.notification_type] || notification.notification_type}
                                </span>
                              </div>
                              {!notification.is_read && (
                                <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full" />
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {notification.notification_message}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(notification.created_at).toLocaleString()}</span>
                              {!notification.is_read && notification.read_at && (
                                <> • Read: {new Date(notification.read_at).toLocaleString()}</>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </div>
          )}
          
          {/* Empty state for system notifications */}
          {filter === "system" && adminNotifications.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No System Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  There are no system notifications at the moment. You'll be notified about maintenance and important updates here.
                </p>
              </CardContent>
            </Card>
          )}

          {/* App Notifications Section */}
        {(filter === "all" || filter !== "system") && (
          <div>
            {(filter === "all" || filter === "unread") && notifications.length > 0 && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                App Activity
              </h2>
            )}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                (filter !== "system" && filteredAdminNotifications.length > 0) ? null : (
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
                )
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
        )}
        </>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={handleCloseModal}
        />
      )}

      {/* Admin Notification Detail Modal */}
      {selectedAdminNotification && (
        <AdminNotificationDetailModal
          notification={selectedAdminNotification}
          onClose={handleCloseAdminModal}
        />
      )}
    </div>
  );
}
