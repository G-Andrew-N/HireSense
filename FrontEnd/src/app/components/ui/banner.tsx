import { X } from "lucide-react";
import { useBanner } from "../../../lib/banner-context";

export function PersistentBanner() {
  const { message, clear } = useBanner();
  if (!message) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-50 px-4 py-3 rounded-b">
          <div className="text-sm">{message}</div>
          <button onClick={clear} className="ml-4 text-amber-900 dark:text-amber-50 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersistentBanner;
