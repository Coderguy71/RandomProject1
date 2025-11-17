import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Spinner, Badge } from '../../components/ui';
import { attemptsAPI } from '../../services/apiServices';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    correctAnswers: 0,
    accuracy: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const activityData = await attemptsAPI.getHistory({ limit: 10 }).catch(() => null);

      if (activityData?.data?.data) {
        const activities = activityData.data.data;
        setRecentActivity(activities);
        
        const correct = activities.filter(a => a.is_correct).length;
        setStats({
          totalAttempts: activities.length,
          correctAnswers: correct,
          accuracy: activities.length > 0 ? Math.round((correct / activities.length) * 100) : 0,
        });
      } else if (Array.isArray(activityData?.data)) {
        const activities = activityData.data;
        setRecentActivity(activities);
        
        const correct = activities.filter(a => a.is_correct).length;
        setStats({
          totalAttempts: activities.length,
          correctAnswers: correct,
          accuracy: activities.length > 0 ? Math.round((correct / activities.length) * 100) : 0,
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" variant="gradient" label="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-premium">
          Welcome back, {user?.firstName || user?.email || 'Scholar'}! 👋
        </h1>
        <p className="text-base text-dark-400">
          {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}! Ready to continue your SAT Math journey?
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Attempts */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary-600/20 rounded-lg">
                <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <Badge variant="secondary" className="text-xs">Total</Badge>
            </div>
            <p className="text-sm font-medium text-dark-400 mb-2">Problems Attempted</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-premium">
              {stats.totalAttempts}
            </p>
          </div>
        </Card>

        {/* Correct Answers */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Badge variant="gradient" className="text-xs">✓ Correct</Badge>
            </div>
            <p className="text-sm font-medium text-dark-400 mb-2">Correct Answers</p>
            <p className="text-3xl font-bold text-green-400">
              {stats.correctAnswers}
            </p>
          </div>
        </Card>

        {/* Accuracy */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <Badge variant="secondary" className="text-xs">Accuracy</Badge>
            </div>
            <p className="text-sm font-medium text-dark-400 mb-2">Your Accuracy</p>
            <p className="text-3xl font-bold text-blue-400">
              {stats.accuracy}%
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card variant="gradient" className="border border-card-border/50">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Quick Start
              </h2>

              <div className="space-y-3">
                <Button 
                  variant="ghost"
                  size="md"
                  className="w-full text-white hover:bg-white/20 justify-start"
                  onClick={() => navigate('/practice')}
                >
                  <span className="text-xl mr-3">✏️</span>
                  Practice Problems
                </Button>

                <Button 
                  variant="ghost"
                  size="md"
                  className="w-full text-white hover:bg-white/20 justify-start"
                  onClick={() => navigate('/tutorials')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  View Tutorials
                </Button>

                <Button 
                  variant="ghost"
                  size="md"
                  className="w-full text-white hover:bg-white/20 justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <Card variant="default" className="border border-card-border/50">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-premium mb-4">
                Recent Activity
              </h2>

              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentActivity.map((activity, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start space-x-3 p-4 bg-dark-800/50 rounded-lg hover:bg-dark-800 transition-colors"
                    >
                      <div className={`mt-1 p-2 rounded flex-shrink-0 ${
                        activity.is_correct 
                          ? 'bg-green-600/20' 
                          : 'bg-red-600/20'
                      }`}>
                        {activity.is_correct ? (
                          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark-200 font-medium truncate">
                          {activity.problem_title || `Problem #${activity.problem_id}`}
                        </p>
                        <p className="text-sm text-dark-400 truncate">
                          {activity.topic_name || activity.subtopic_name}
                        </p>
                        <p className="text-xs text-dark-500 mt-1">
                          {new Date(activity.created_at).toLocaleDateString()} {new Date(activity.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="text-5xl mb-4">📚</div>
                  <p className="text-sm text-dark-400 mb-4">
                    No activity yet. Start practicing to see your progress here!
                  </p>
                  <Button 
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/practice')}
                  >
                    Start Practicing
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Tips Section */}
      <Card variant="glass" className="border border-card-border/50">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-premium mb-4">
            💡 Tips for Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
              <p className="text-sm font-medium text-blue-400 mb-2">Practice Daily</p>
              <p className="text-sm text-blue-300">Consistent daily practice is key to improving your SAT math skills and building confidence.</p>
            </div>
            <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
              <p className="text-sm font-medium text-purple-400 mb-2">Watch Tutorials</p>
              <p className="text-sm text-purple-300">Learn different approaches and techniques through our comprehensive tutorial library.</p>
            </div>
            <div className="p-4 bg-green-900/20 rounded-lg border border-green-800/30">
              <p className="text-sm font-medium text-green-400 mb-2">Track Progress</p>
              <p className="text-sm text-green-300">Monitor your accuracy and identify areas for improvement to maximize your score.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
