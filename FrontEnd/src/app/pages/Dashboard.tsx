import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  FileText,
  ArrowRight,
  Sparkles,
  Briefcase,
  Upload
} from "lucide-react";
import { mockJobMatches, mockStats } from "../data/mockData";
import { Link } from "react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";

const chartData = [
  { name: "Mon", applications: 4 },
  { name: "Tue", applications: 7 },
  { name: "Wed", applications: 5 },
  { name: "Thu", applications: 9 },
  { name: "Fri", applications: 6 },
  { name: "Sat", applications: 3 },
  { name: "Sun", applications: 2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function Dashboard() {
  const topMatches = mockJobMatches.slice(0, 3);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's your job search overview."
      />
      
      {/* Mobile Resume Upload Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden mx-4 mt-4"
      >
        <Link to="/dashboard/resume">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between gap-3 hover:from-emerald-700 hover:to-teal-700 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Upload Your Resume</p>
                <p className="text-white/80 text-xs">Start getting AI-powered job matches</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white flex-shrink-0" />
          </div>
        </Link>
      </motion.div>
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20 lg:pb-8">
        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Matches
                </CardTitle>
                <Target className="w-4 h-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-gray-900 dark:text-gray-100"
                >
                  {mockStats.totalMatches}
                </motion.div>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last week
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Match Score
                </CardTitle>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-gray-900 dark:text-gray-100"
                >
                  {mockStats.averageMatchScore}%
                </motion.div>
                <Progress value={mockStats.averageMatchScore} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  High Probability
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-gray-900 dark:text-gray-100"
                >
                  {mockStats.highProbabilityJobs}
                </motion.div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Jobs with 70%+ interview chance
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Resume Score
                </CardTitle>
                <FileText className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-gray-900 dark:text-gray-100"
                >
                  {mockStats.resumeScore}%
                </motion.div>
                <Link to="/dashboard/insights" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-1 inline-block">
                  View improvements →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Activity Chart and AI Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Activity Chart */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Application Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="applications" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-100 dark:border-emerald-900 hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your resume is performing well, but adding <span className="font-semibold">GraphQL</span> and <span className="font-semibold">Kubernetes</span> could increase matches by 23%.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Best time to apply: <span className="font-semibold">Tuesday-Thursday, 9-11 AM</span>
                  </p>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-105" asChild>
                  <Link to="/dashboard/insights">
                    View All Insights
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Top Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Matches</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/matches">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {topMatches.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.company} • {job.location}</p>
                      </div>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900 w-fit">
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Interview Probability:</span>
                        <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">{job.interviewProbability}%</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{job.salary}</div>
                      <Badge variant="outline" className="text-xs w-fit">{job.source}</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}