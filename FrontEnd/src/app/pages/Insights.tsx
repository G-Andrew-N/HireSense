import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Lightbulb, 
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  X,
  Check
} from "lucide-react";
import { mockInsights } from "../data/mockData";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function Insights() {
  const [ignoredInsights, setIgnoredInsights] = useState<string[]>([]);
  
  const visibleInsights = mockInsights.filter(insight => !ignoredInsights.includes(insight.id));
  
  const allInsights = [...visibleInsights].sort((a, b) => {
    const priorityOrder = { critical: 0, important: 1, suggestion: 2 };
    return priorityOrder[a.category as keyof typeof priorityOrder] - priorityOrder[b.category as keyof typeof priorityOrder];
  });

  const criticalCount = visibleInsights.filter(i => i.category === "critical").length;
  const importantCount = visibleInsights.filter(i => i.category === "important").length;
  const suggestionCount = visibleInsights.filter(i => i.category === "suggestion").length;

  const handleIgnore = (id: string) => {
    setIgnoredInsights(prev => [...prev, id]);
  };

  const handleApply = (id: string) => {
    // Handle apply logic - could show a success message, etc.
    console.log("Applied recommendation:", id);
    // For now, we'll also remove it from view after applying
    setIgnoredInsights(prev => [...prev, id]);
  };

  const getPriorityBadge = (category: string) => {
    if (category === "critical") return <Badge className="bg-red-600 text-white border-0">Critical</Badge>;
    if (category === "important") return <Badge className="bg-orange-500 text-white border-0">Important</Badge>;
    return <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Suggestion</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    if (category === "critical") return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />;
    if (category === "important") return <TrendingUp className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
    return <Lightbulb className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header 
        title="Resume Insights" 
        subtitle="AI-powered suggestions to improve your resume and increase match rates"
      />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20 lg:pb-8">
        {/* AI Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 border-0 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    <h3 className="text-lg sm:text-xl font-semibold">Potential Impact</h3>
                  </div>
                  <p className="text-emerald-100 text-sm mb-4">
                    By implementing these {allInsights.length} recommendations, you could significantly improve your job application success rate.
                  </p>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold">+23%</div>
                      <div className="text-xs sm:text-sm text-emerald-100">Match Rate Increase</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold">72% → 88%</div>
                      <div className="text-xs sm:text-sm text-emerald-100">Interview Probability</div>
                    </div>
                  </div>
                </div>
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50 w-full sm:w-auto sm:shrink-0">
                  Apply All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <motion.div 
            className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-3xl sm:text-4xl">🚨</div>
            <div className="text-center sm:text-left">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{criticalCount}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Critical</div>
            </div>
          </motion.div>
          <motion.div 
            className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-3xl sm:text-4xl">⚠️</div>
            <div className="text-center sm:text-left">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{importantCount}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Important</div>
            </div>
          </motion.div>
          <motion.div 
            className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-3xl sm:text-4xl">💡</div>
            <div className="text-center sm:text-left">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{suggestionCount}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Suggestions</div>
            </div>
          </motion.div>
        </div>

        {/* All Insights - Unified List */}
        <Card>
          <CardHeader>
            <CardTitle>All Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="popLayout">
              {allInsights.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">All Caught Up!</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">You've reviewed all recommendations.</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {allInsights.map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      layout
                      className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                          {getCategoryIcon(insight.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</h4>
                            {getPriorityBadge(insight.category)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">Impact:</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  insight.impact === 'high' 
                                    ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400' 
                                    : insight.impact === 'medium'
                                    ? 'border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-400'
                                    : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-400'
                                }`}
                              >
                                {insight.impact}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 sm:ml-auto">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                                onClick={() => handleIgnore(insight.id)}
                              >
                                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Ignore
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                                onClick={() => handleApply(insight.id)}
                              >
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}