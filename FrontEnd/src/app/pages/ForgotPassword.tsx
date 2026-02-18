import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router";
import { requestPasswordReset } from "../../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Target, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch {
      toast.error("Could not send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 dark:from-gray-950 dark:via-emerald-950/20 dark:to-teal-950/20">
      {/* Back to Login - Top Left */}
      <div className="fixed top-0 left-0 z-50 p-4 sm:p-6">
        <Link 
          to="/login"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to login</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 sm:p-8 pt-16 sm:pt-8">
        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-xl">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rotate-45">
                <Target className="w-6 h-6 text-white -rotate-45" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                HireSense
              </h1>
            </div>

            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Forgot password?
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    No worries, we'll send you reset instructions
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    {loading ? "Sending..." : "Send reset instructions"}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 dark:bg-green-900/30 mx-auto mb-4 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  We've sent password reset instructions to{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-100 block mt-1">{email}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold"
                  >
                    Click to resend
                  </button>
                </p>
              </motion.div>
            )}
          </div>

          {/* Help text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help?{" "}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors">
                Contact support
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}