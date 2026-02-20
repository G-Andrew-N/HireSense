import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api';
import { motion } from 'motion/react';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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
          apiRequest<{ results: SystemNotification[] }>('/admin/notifications/'),
        ]);

        setStats(statsData);
        setNotifications(notificationsData.results || []);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
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
        apiRequest<{ results: SystemNotification[] }>('/admin/notifications/'),
      ]);

      setStats(statsData);
      setNotifications(notificationsData.results || []);
      setSuccess('Stats refreshed');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const newNotification = await apiRequest<SystemNotification>('/admin/notifications/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Send notification immediately
      await apiRequest('/admin/notifications/send_notification/', {
        method: 'POST',
        body: JSON.stringify({ notification_id: newNotification.id }),
      });

      // Refresh notifications list to get the updated notification with is_sent=true
      const updatedNotifications = await apiRequest<{ results: SystemNotification[] }>('/admin/notifications/');
      setNotifications(updatedNotifications.results || []);
      
      setFormData({ title: '', message: '', notification_type: 'info' });
      setShowNotificationForm(false);
      setSuccess('Notification sent successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notification');
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
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white rounded-lg font-medium transition"
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

        {/* Error and Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-200"
          >
            {success}
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
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
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
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
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
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
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
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
          className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-8"
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
          className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              System Notifications
            </h2>
            <button
              onClick={() => setShowNotificationForm(!showNotificationForm)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                >
                  Send to All Users
                </button>
              </div>
            </motion.form>
          )}

          {/* Notifications List */}
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {notifications.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification, index) => (
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
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    <div className="text-right">
                      {notification.is_sent ? (
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          Sent
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Pending
                        </div>
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
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
