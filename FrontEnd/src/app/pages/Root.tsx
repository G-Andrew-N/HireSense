import { Outlet, useNavigate } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { ThemeProvider } from "next-themes";
import { MobileNav } from "../components/MobileNav";
import { useEffect } from "react";

export function Root() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (!isAuthenticated) {
      // Redirect to landing page if not authenticated
      navigate("/", { replace: true });
    }
  }, [navigate]);

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
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}