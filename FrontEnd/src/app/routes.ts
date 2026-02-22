import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Resume } from "./pages/Resume";
import { JobMatches } from "./pages/JobMatches";
import { Insights } from "./pages/Insights";
import { Settings } from "./pages/Settings";
import { Notifications } from "./pages/Notifications";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Root } from "./pages/Root";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { TermsOfService } from "./pages/TermsOfService";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/reset-password/:uid/:token",
    Component: ResetPassword,
  },
  {
    path: "/terms-of-service",
    Component: TermsOfService,
  },
  {
    path: "/privacy-policy",
    Component: PrivacyPolicy,
  },
  {
    path: "/dashboard",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "resume", Component: Resume },
      { path: "matches", Component: JobMatches },
      { path: "insights", Component: Insights },
      { path: "settings", Component: Settings },
      { path: "notifications", Component: Notifications },
    ],
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);