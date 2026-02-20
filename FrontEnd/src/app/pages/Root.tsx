import { Outlet, useNavigate } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { ThemeProvider } from "next-themes";
import { MobileNav } from "../components/MobileNav";
import { ScanProvider } from "../../lib/scan-context";
import { NotificationProvider } from "../../lib/notification-context";
import { useEffect } from "react";
import { useAuth } from "../../lib/auth-context";

export function Root() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Mobile Navigation */}
        <MobileNav />
        
        <div className="flex-1 flex flex-col overflow-hidden pt-[57px] lg:pt-0">
          <NotificationProvider>
            <ScanProvider>
              <Outlet />
            </ScanProvider>
          </NotificationProvider>
        </div>
      </div>
    </ThemeProvider>
  );
}