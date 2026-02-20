import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Lightbulb, 
  Settings,
  Target,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Bell
} from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { useNotification } from "../../lib/notification-context";
import { apiRequest } from "../../lib/api";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume", href: "/dashboard/resume", icon: FileText },
  { name: "Job Matches", href: "/dashboard/matches", icon: Briefcase },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface AdminNotification {
  id: number;
  is_read: boolean;
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);

  // Fetch admin notifications
  useEffect(() => {
    const fetchAdminNotifications = async () => {
      try {
        const response = await apiRequest<AdminNotification[] | { results: AdminNotification[] }>('/notifications/');
        const notifications = Array.isArray(response) ? response : (response.results || []);
        setAdminNotifications(notifications);
      } catch (error) {
        // Silently fail - user might not be logged in
      }
    };

    fetchAdminNotifications();
    // Refresh every minute
    const interval = setInterval(fetchAdminNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total unread count
  const appUnreadCount = notifications.filter(n => !n.read).length;
  const adminUnreadCount = adminNotifications.filter(n => !n.is_read).length;
  const totalUnreadCount = appUnreadCount + adminUnreadCount;

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rotate-45">
              <Target className="w-5 h-5 text-white -rotate-45" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              HireSense
            </h1>
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => navigate("/dashboard/notifications")}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 flex items-center justify-center bg-emerald-600 text-white text-xs font-bold rounded-full px-1">
                  {totalUnreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-[57px] left-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col"
            >
              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = item.href === "/" 
                    ? location.pathname === "/" 
                    : location.pathname.startsWith(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 transition-colors",
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name || user?.email || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email ?? ""}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 font-medium transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}