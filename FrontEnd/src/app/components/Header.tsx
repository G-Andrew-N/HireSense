import { Bell, Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router";
import { useScan } from "../../lib/scan-context";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function Header({ title, subtitle, showSearch = false }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Global scanning indicator */}
        {(() => {
          try {
            const scan = useScan();
            if (scan.isScanning) {
              return (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning</span>
                </div>
              );
            }
          } catch {
            /* ignore when not inside provider */
          }
          return null;
        })()}
        {showSearch && (
          <div className="relative flex-1 sm:flex-initial sm:w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search jobs..." 
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
        )}
        
        <ThemeToggle className="hidden lg:flex" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative flex-shrink-0 hidden lg:flex"
          onClick={() => navigate("notifications")}
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
        </Button>
      </div>
    </div>
  );
}