import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AdminStats {
  users: {
    total: number;
    active_7d: number;
    new_30d: number;
  };
  resumes: {
    total: number;
  };
  jobs: {
    total_postings: number;
    total_matches: number;
  };
  notifications: {
    sent: number;
    pending: number;
  };
  status: string;
}

interface SystemNotification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  created_by: number;
  created_by_email: string;
  is_sent: boolean;
  send_immediately: boolean;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notification_type: 'info',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [clearingHistory, setClearingHistory] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sendingIds, setSendingIds] = useState<Set<number>>(new Set());

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Check if user is superuser
  useEffect(() => {
    if (!isLoading && (!user || !user.is_superuser)) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  // Fetch stats and notifications
  useEffect(() => {
    if (!user?.is_superuser) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, notificationsData] = await Promise.all([
          apiRequest<AdminStats>('/admin/notifications/admin_stats/'),
          apiRequest<SystemNotification[]>('/admin/notifications/'),
        ]);

        setStats(statsData);
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // No auto-refresh interval - use manual refresh button instead
  }, [user?.is_superuser]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const [statsData, notificationsData] = await Promise.all([
        apiRequest<AdminStats>('/admin/notifications/admin_stats/'),
        apiRequest<SystemNotification[]>('/admin/notifications/'),
      ]);

      setStats(statsData);
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      showToast('Stats refreshed', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to refresh data', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest<SystemNotification>('/admin/notifications/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Refresh notifications list to show the new pending notification
      const updatedNotifications = await apiRequest<SystemNotification[]>('/admin/notifications/');
      setNotifications(Array.isArray(updatedNotifications) ? updatedNotifications : []);
      
      setFormData({ title: '', message: '', notification_type: 'info' });
      setShowNotificationForm(false);
      setActiveTab('pending'); // Switch to pending tab to see the new notification
      showToast('Notification created and added to pending queue', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create notification', 'error');
    }
  };

  const handleSendNotification = async (notificationId: number) => {
    try {
      setSendingIds(prev => new Set(prev).add(notificationId));
      
      // Send notification
      await apiRequest('/admin/notifications/send_notification/', {
        method: 'POST',
        body: JSON.stringify({ notification_id: notificationId }),
      });

      // Refresh notifications list
      const updatedNotifications = await apiRequest<SystemNotification[]>('/admin/notifications/');
      setNotifications(Array.isArray(updatedNotifications) ? updatedNotifications : []);
      
      showToast('Notification sent successfully!', 'success');
      
      // Auto switch to history tab to see the sent notification
      setActiveTab('history');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to send notification', 'error');
    } finally {
      setSendingIds(prev => {
        const next = new Set(prev);
        next.delete(notificationId);
        return next;
      });
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all notification history? This action cannot be undone.')) {
      return;
    }

    try {
      setClearingHistory(true);
      await apiRequest('/admin/notifications/clear_history/', {
        method: 'POST',
      });

      // Refresh notifications list
      const updatedNotifications = await apiRequest<SystemNotification[]>('/admin/notifications/');
      setNotifications(Array.isArray(updatedNotifications) ? updatedNotifications : []);
      
      showToast('Notification history cleared successfully!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to clear history', 'error');
    } finally {
      setClearingHistory(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user?.is_superuser) {
    return null; // Will be redirected by useEffect
  }

  const notificationType = {
    'maintenance': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Maintenance' },
    'important': { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'Important' },
    'info': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Information' },
    'alert': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Alert' },
    'warning': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', label: 'Warning' },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor system health and manage notifications
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white font-medium transition"
          >
            {refreshing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </span>
            ) : (
              'Refresh'
            )}
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Total Users
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {stats?.users.total || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stats?.users.active_7d || 0} active (7d)
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              New Users (30d)
            </div>
            <div className="text-4xl font-bold text-emerald-600 mb-2">
              {stats?.users.new_30d || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Recent signups
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Job Matches
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {stats?.jobs.total_matches || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stats?.jobs.total_postings || 0} postings
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Notifications
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {stats?.notifications.sent || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stats?.notifications.pending || 0} pending
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                System Status
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                All systems operational
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {stats?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Notification Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              System Notifications
            </h2>
            <button
              onClick={() => setShowNotificationForm(!showNotificationForm)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
            >
              {showNotificationForm ? 'Cancel' : 'New Notification'}
            </button>
          </div>

          {/* Notification Form */}
          {showNotificationForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateNotification}
              className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter notification title"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.notification_type}
                    onChange={(e) =>
                      setFormData({ ...formData, notification_type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="info">Information</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="important">Important Update</option>
                    <option value="alert">Alert</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Enter your message here"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
                >
                  Create Notification
                </button>
              </div>
            </motion.form>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition ${
                activeTab === 'pending'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              Pending ({notifications.filter(n => !n.is_sent).length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition ${
                activeTab === 'history'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              History ({notifications.filter(n => n.is_sent).length})
            </button>
          </div>

          {/* Clear History Button */}
          {activeTab === 'history' && notifications.filter(n => n.is_sent).length > 0 && (
            <div className="px-6 py-3 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={handleClearHistory}
                disabled={clearingHistory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition text-sm"
              >
                {clearingHistory ? 'Clearing...' : 'Clear History'}
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {(() => {
              const filteredNotifications = notifications.filter(n => 
                activeTab === 'pending' ? !n.is_sent : n.is_sent
              );

              if (filteredNotifications.length === 0) {
                return (
                  <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {activeTab === 'pending' 
                      ? 'No pending notifications' 
                      : 'No notification history'}
                  </div>
                );
              }

              return filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <span
                        className={`px-3 py-1 text-xs font-medium ${
                          notificationType[notification.notification_type as keyof typeof notificationType]?.color ||
                          notificationType.info.color
                        }`}
                      >
                        {notificationType[notification.notification_type as keyof typeof notificationType]?.label ||
                          notification.notification_type}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {notification.is_sent ? (
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20">
                          Sent
                        </div>
                      ) : (
                        <>
                          <div className="text-sm text-orange-600 dark:text-orange-400 font-medium px-3 py-1 bg-orange-50 dark:bg-orange-900/20">
                            Pending
                          </div>
                          <button
                            onClick={() => handleSendNotification(notification.id)}
                            disabled={sendingIds.has(notification.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition"
                          >
                            {sendingIds.has(notification.id) ? 'Sending...' : 'Send Now'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {notification.message}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    By {notification.created_by_email} •{' '}
                    {new Date(notification.created_at).toLocaleString()}
                    {notification.is_sent && notification.sent_at && (
                      <> • Sent: {new Date(notification.sent_at).toLocaleString()}</>
                    )}
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </motion.div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`px-6 py-4 shadow-lg border min-w-[300px] max-w-md ${
                toast.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-900/90 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-100'
                  : toast.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-700 text-red-800 dark:text-red-100'
                  : 'bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {toast.type === 'success' && (
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.type === 'error' && (
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.type === 'info' && (
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
                <p className="flex-1 font-medium text-sm">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
