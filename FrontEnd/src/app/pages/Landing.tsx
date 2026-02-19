import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Target, Sparkles, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Landing() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rotate-45">
                <Target className="w-6 h-6 text-white -rotate-45" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">HireSense</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" className="hidden sm:inline-flex bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-lg">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto"
            >
              Land Your Dream Job with{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI-Powered Insights
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-400 mb-4 max-w-2xl mx-auto"
            >
              Automate your job search, analyze resume matches, and get AI-driven recommendations to increase your interview success rate.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-sm text-emerald-200 max-w-2xl mx-auto mb-10"
            >
              HireSense focuses on discovering remote roles listed on supported public job sources (for example, Remotive and We Work Remotely). It does not search private or enterprise-only listings.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            >
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg px-8 py-6 w-full sm:w-auto rounded-lg">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-lg">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-900 border border-gray-800 p-6 sm:p-8 text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Smart Resume Analysis
                </h3>
                <p className="text-gray-400">
                  AI analyzes your resume against job descriptions to identify gaps and opportunities for improvement.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-900 border border-gray-800 p-6 sm:p-8 text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Match Probability Scores
                </h3>
                <p className="text-gray-400">
                  Get real-time probability scores for each job to focus your efforts on the best opportunities.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gray-900 border border-gray-800 p-6 sm:p-8 text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Actionable Insights
                </h3>
                <p className="text-gray-400">
                  Receive personalized recommendations to optimize your applications and increase success rates.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}