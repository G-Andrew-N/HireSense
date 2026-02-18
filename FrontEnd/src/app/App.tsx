import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "../lib/auth-context";
import { router } from "./routes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <Toaster position="top-right" duration={3000} richColors />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
