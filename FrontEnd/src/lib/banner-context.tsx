import { createContext, useContext, useState, type ReactNode } from "react";

type BannerValue = {
  message: string | null;
  show: (msg: string) => void;
  clear: () => void;
};

const BannerContext = createContext<BannerValue | null>(null);

export function BannerProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const show = (msg: string) => setMessage(msg);
  const clear = () => setMessage(null);

  return (
    <BannerContext.Provider value={{ message, show, clear }}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error("useBanner must be used within BannerProvider");
  return ctx;
}

export default BannerProvider;
