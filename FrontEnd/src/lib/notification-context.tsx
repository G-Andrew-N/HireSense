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
  resetNotifications: (notifications: Notification[]) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const STORAGE_KEY = "hiresense_notifications";

// Mock data for initial load only
const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "match",
    title: "New High-Priority Match!",
    message: "Senior Frontend Developer at TechCorp matches your profile at 94%. Apply before the deadline.",
    time: "5 minutes ago",
    read: false,
    priority: "high",
    details: "Position: Senior Frontend Developer at TechCorp\nLocation: San Francisco, CA (Remote Available)\nSalary: $150,000 - $180,000\n\nThis position is an excellent match! The company is looking for someone with React expertise and your resume shows strong alignment with their requirements.\n\nKey Responsibilities:\n• Lead frontend architecture decisions\n• Mentor junior developers\n• Collaborate with product team\n\nApplications close: December 25, 2024\n\nRecommended: Apply within the next 24 hours for higher visibility."
  },
  {
    id: "2",
    type: "achievement",
    title: "Application Milestone Reached",
    message: "Congratulations! You've reached 50 job applications this month.",
    time: "1 hour ago",
    read: false,
    details: "You're on a roll! Here's your application progress:\n\n📊 Applications This Month: 50\n✅ Responded: 8\n⏳ Pending: 15\n❌ Not Selected: 27\n\nResponse Rate: 16% (above average 10%)\n\nKeep up the momentum! Continue applying to roles that match your criteria."
  },
  {
    id: "3",
    type: "insight",
    title: "Resume Optimization Tip",
    message: "Adding 'React Hooks' to your skills could increase your match rate by 15%.",
    time: "3 hours ago",
    read: false,
    details: "Our analysis shows that many high-match positions (85%+) require 'React Hooks' experience.\n\nCurrent Skills: React, JavaScript, TypeScript\nSuggested Addition: React Hooks, React Context\n\nHow to Update:\n1. Open your resume\n2. Add to Technical Skills section\n3. Re-upload to update your profile\n\nEstimated Impact: 15% increase in match rate for senior positions"
  },
  {
    id: "4",
    type: "match",
    title: "3 New Job Matches Found",
    message: "We found 3 new positions matching your criteria in San Francisco.",
    time: "5 hours ago",
    read: true,
    details: "New Matches Found:\n\n1. Full Stack Developer - StartupXYZ (87% match)\n2. Tech Lead - InnovateLabs (92% match)\n3. Senior Engineer - TechCorp (94% match)\n\nVisit Job Matches to view all details and apply directly."
  },
  {
    id: "5",
    type: "resume",
    title: "Resume Analysis Complete",
    message: "Your updated resume has been analyzed. View 8 new improvement suggestions.",
    time: "Yesterday",
    read: true,
    details: "Resume Analysis Summary:\n\n✓ Strong Sections: Skills, Experience\n⚠ Needs Work: Cover Letter, Certifications\n\nTop Suggestions:\n1. Add quantifiable achievements\n2. Include technical certifications\n3. Expand on leadership experience\n\nView detailed suggestions in Resume section."
  },
  {
    id: "6",
    type: "system",
    title: "Weekly Activity Report Ready",
    message: "Your job search summary for this week is now available.",
    time: "Yesterday",
    read: true,
    details: "Weekly Report Summary:\n\nApplications: 12\nMatches: 15\nProfile Views: 23\nInterview Invites: 1\n\nTop Matching Skills: React, JavaScript, Leadership\nMost Common Position: Senior Frontend Developer\n\nView full report in Dashboard."
  },
  {
    id: "7",
    type: "match",
    title: "Job Match Alert",
    message: "Product Manager at InnovateLabs (89% match) - Premium opportunity.",
    time: "2 days ago",
    read: true,
    priority: "high",
    details: "Position: Product Manager at InnovateLabs\nMatch Score: 89%\n\nWhy it matches:\n• Your background in product strategy\n• Experience with cross-functional teams\n• Track record in SaaS products\n\nThis is a premium opportunity with leadership potential. Apply today!"
  },
  {
    id: "8",
    type: "insight",
    title: "Application Strategy Insight",
    message: "Jobs posted on Monday mornings have a 23% higher response rate. Plan accordingly!",
    time: "3 days ago",
    read: true,
    details: "Based on analysis of 10,000+ applications:\n\n📈 Best Times to Apply:\n• Monday 9 AM - 12 PM: 23% higher response\n• Tuesday 10 AM - 2 PM: 18% higher response\n• Wednesday 8 AM - 11 AM: 15% higher response\n\n💡 Strategy: Schedule your applications for Monday mornings when recruiters are most active!"
  },
  {
    id: "9",
    type: "system",
    title: "System Maintenance Scheduled",
    message: "HireSense will undergo brief maintenance on Sunday at 2 AM PST.",
    time: "4 days ago",
    read: true,
    details: "Maintenance Window: Sunday, 2 AM - 4 AM PST\n\nExpected Impact:\n• Job search may be temporarily unavailable\n• Resume uploads will be disabled\n• No new matches will be generated during this time\n\nWe apologize for any inconvenience. Services will be restored shortly."
  }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount, with fallback to default notifications
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
      // Only load default notifications if localStorage is empty (first time)
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
