import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type ScanContextValue = {
  isScanning: boolean;
  setScanning: (v: boolean) => void;
};

const ScanContext = createContext<ScanContextValue | null>(null);

const SCAN_STATE_KEY = "hiresense:is-scanning";

export function ScanProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage to persist across navigation
  const [isScanning, setIsScanningState] = useState(() => {
    try {
      return localStorage.getItem(SCAN_STATE_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Wrapper to sync with localStorage
  const setScanning = (v: boolean) => {
    setIsScanningState(v);
    try {
      if (v) {
        localStorage.setItem(SCAN_STATE_KEY, "true");
      } else {
        localStorage.removeItem(SCAN_STATE_KEY);
      }
    } catch {}
  };

  // Sync with localStorage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SCAN_STATE_KEY) {
        setIsScanningState(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ScanContext.Provider value={{ isScanning, setScanning }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScan must be used within ScanProvider");
  return ctx;
}
