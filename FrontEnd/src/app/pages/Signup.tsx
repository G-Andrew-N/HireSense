import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { register } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Target, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Camera } from "lucide-react";
import { motion } from "motion/react";

export function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await register(
        formData.email,
        formData.password,
        formData.fullName.trim() || undefined,
        avatarFile ?? undefined
      );
      setUser(res.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { body?: { email?: string[]; detail?: string } })?.body?.email?.[0]
        ?? (err as { body?: { detail?: string } })?.body?.detail
        ?? "Signup failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const passwordStrength = formData.password.length >= 8;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 dark:from-gray-950 dark:via-emerald-950/20 dark:to-teal-950/20">
      {/* Back to Home - Top Left */}
      <div className="fixed top-0 left-0 z-50 p-4 sm:p-6">
        <Link 
          to="/"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to home</span>
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

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Start automating your job applications with AI
              </p>
            </motion.div>

            {/* Form */}
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSignup} 
              className="space-y-5"
            >
              <div className="flex flex-col items-center gap-4">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile photo (optional)</Label>
                <label className="relative block cursor-pointer group">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-2 ring-transparent group-hover:ring-emerald-400 transition-all">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white font-medium text-center px-2">
                    Add photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleAvatarChange}
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">JPG or PNG, max 5MB</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <p className={`text-xs ${passwordStrength ? "text-green-600" : "text-orange-600"}`}>
                    {passwordStrength ? "✓ Strong password" : "Password must be at least 8 characters"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
                {formData.confirmPassword && (
                  <p className={`text-xs ${formData.password === formData.confirmPassword ? "text-green-600" : "text-red-600"}`}>
                    {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <Link to="/terms-of-service" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </motion.form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">OR</span>
              </div>
            </div>

            {/* Login link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6">
            <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <Link to="/terms-of-service" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}