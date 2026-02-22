import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../lib/auth-context";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Lightbulb, 
  Settings,
  Target,
  LogOut,
  Shield
} from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { motion } from "motion/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume", href: "/dashboard/resume", icon: FileText },
  { name: "Job Matches", href: "/dashboard/matches", icon: Briefcase },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rotate-45">
          <Target className="w-5 h-5 text-white -rotate-45" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          HireSense
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = item.href === "/dashboard" 
            ? location.pathname === "/dashboard" 
            : location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
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
          {user?.avatar && user.avatar.trim() ? (
            <img
              src={user.avatar}
              alt={user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.email ?? "User"}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                // Fallback to default if image fails to load
                (e.target as HTMLImageElement).src = "/api/media/avatars/default";
              }}
            />
          ) : (
            <img
              src="/api/media/avatars/default"
              alt={user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.email ?? "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name || user?.email || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email ?? ""}</p>
          </div>
        </div>
        {user?.is_superuser && (
          <motion.div
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/admin"
              className="flex items-center gap-2 w-full px-3 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg font-medium transition-all duration-200"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </Link>
          </motion.div>
        )}
        <motion.div
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 font-medium transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}