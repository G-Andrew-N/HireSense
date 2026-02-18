import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ScanContextValue = {
  isScanning: boolean;
  setScanning: (v: boolean) => void;
};

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [isScanning, setScanning] = useState(false);
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
