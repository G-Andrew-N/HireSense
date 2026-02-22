import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type NotificationType = "match" | "resume" | "insight" | "system" | "achievement";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority?: "high" | "normal";
  details?: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearReadNotifications: () => void;
  clearNonSystemNotifications: () => void;
  resetNotifications: (notifications: Notification[]) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const STORAGE_KEY = "hiresense_notifications_v2";

// No default notifications; start empty until populated by the app
const DEFAULT_NOTIFICATIONS: Notification[] = [];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount, with fallback to empty notifications
  useEffect(() => {
    const savedNotifications = localStorage.getItem(STORAGE_KEY);
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (err) {
        console.error("Failed to parse saved notifications", err);
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    } else {
      // Start empty if localStorage is empty (first time)
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
    setIsInitialized(true);
  }, []);

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearReadNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  const clearNonSystemNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(n => n.type === "system"));
  }, []);

  const resetNotifications = useCallback((newNotifications: Notification[]) => {
    setNotifications(newNotifications);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        clearReadNotifications,
        clearNonSystemNotifications,
        resetNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
