import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, ProgressBar, Spinner, Badge } from '../../components/ui';
import { villageAPI, attemptsAPI } from '../../services/apiServices';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [village, setVillage] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userStreak, setUserStreak] = useState({ current: 0, best: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [villageData, activityData] = await Promise.all([
        villageAPI.getVillageState().catch(() => null),
        attemptsAPI.getHistory({ limit: 5 }).catch(() => null),
      ]);

      setVillage(villageData?.data || villageData);
      
      if (activityData?.data?.data) {
        setRecentActivity(activityData.data.data);
      } else if (Array.isArray(activityData?.data)) {
        setRecentActivity(activityData.data);
      }

      // Extract streak data from village
      if (villageData?.data?.streak) {
        setUserStreak({
          current: villageData.data.streak.currentStreak || 0,
          best: villageData.data.streak.longestStreak || 0,
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

  const villageHealth = village?.resources?.health || 50;
  const villageLevel = village?.resources?.level || 1;
  const currentStreak = userStreak.current;
  const longestStreak = userStreak.best;

  return (
    <div className="animate-fade-in space-y-5">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Welcome Section */}
      <div className="space-y-1 mb-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-premium">
          Welcome back, {user?.firstName || user?.email || 'Scholar'}! 👋
        </h1>
        <p className="text-sm sm:text-base text-dark-400">
          {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}! Ready to continue your SAT Math journey?
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* User Info */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-primary-600/20 rounded-lg">
                <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <Badge variant="secondary" className="text-xs">You</Badge>
            </div>
            <p className="text-xs sm:text-sm font-medium text-dark-400 mb-1.5">Username</p>
            <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-premium truncate">
              {user?.username || user?.email?.split('@')[0] || 'Scholar'}
            </p>
            <p className="text-xs text-dark-500 mt-1.5">{user?.email}</p>
          </div>
        </Card>

        {/* Current Streak */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-orange-600/20 rounded-lg">
                <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <Badge variant="gradient" className="text-xs">🔥 Active</Badge>
            </div>
            <p className="text-xs sm:text-sm font-medium text-dark-400 mb-1.5">Current Streak</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-400">{currentStreak}</p>
            <p className="text-xs text-dark-500 mt-1.5">Best: {longestStreak} days</p>
          </div>
        </Card>

        {/* Village Level */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-blue-600/20 rounded-lg">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <Badge variant="secondary" className="text-xs">Level {villageLevel}</Badge>
            </div>
            <p className="text-xs sm:text-sm font-medium text-dark-400 mb-1.5">Village Level</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-400">{villageLevel}</p>
            <p className="text-xs text-dark-500 mt-1.5">Build your empire!</p>
          </div>
        </Card>

        {/* Village Health */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-green-600/20 rounded-lg">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <Badge variant="secondary" className="text-xs">Health</Badge>
            </div>
            <p className="text-xs sm:text-sm font-medium text-dark-400 mb-1.5">Village Health</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">{villageHealth}%</p>
            <ProgressBar 
              value={villageHealth} 
              max={100}
              className="mt-2.5"
              showLabel={false}
            />
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Your Village Preview */}
        <div className="lg:col-span-2">
          <Card variant="default" className="border border-card-border/50">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-premium">
                  Your Village
                </h2>
                <Badge variant="gradient" className="text-xs">
                  Keep it healthy!
                </Badge>
              </div>

              <div className="relative h-40 bg-gradient-to-b from-blue-900/20 to-dark-800 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-1">🏘️</div>
                  <p className="text-sm text-dark-400">Level {villageLevel} Village</p>
                  <p className="text-xs text-dark-500 mt-0.5">Health: {villageHealth}% 💚</p>
                </div>
              </div>

              <div className="space-y-2.5 mb-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-medium text-dark-400">Village Health</p>
                    <p className="text-xs text-primary-400 font-semibold">{villageHealth}%</p>
                  </div>
                  <ProgressBar value={villageHealth} max={100} showLabel={false} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-medium text-dark-400">Resources</p>
                    <p className="text-xs text-orange-400 font-semibold">{village?.resources?.gold || 0} 🪙</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => navigate('/village')}
              >
                View Full Village
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 sm:space-y-5">
          <Card variant="gradient" className="border border-card-border/50">
            <div className="p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
                Quick Start
              </h2>

              <div className="space-y-2.5">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="w-full text-white hover:bg-white/20 justify-start"
                  onClick={() => navigate('/practice')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Practice Problems
                </Button>

                <Button 
                  variant="ghost"
                  size="sm"
                  className="w-full text-white hover:bg-white/20 justify-start"
                  onClick={() => navigate('/tutorials')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  View Tutorials
                </Button>

                <Button 
                  variant="ghost"
                  size="sm"
                  className="w-full text-white hover:bg-white/20 justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <Card variant="default" className="border border-card-border/50">
            <div className="p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-premium mb-3">
                Recent Activity
              </h2>

              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {recentActivity.slice(0, 5).map((activity, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start space-x-2 p-2.5 bg-dark-800/50 rounded-lg hover:bg-dark-800 transition-colors"
                    >
                      <div className={`mt-0.5 p-1 rounded flex-shrink-0 ${
                        activity.is_correct 
                          ? 'bg-green-600/20' 
                          : 'bg-red-600/20'
                      }`}>
                        {activity.is_correct ? (
                          <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-dark-200 font-medium truncate">
                          {activity.problem_title || `Problem #${activity.problem_id}`}
                        </p>
                        <p className="text-xs text-dark-400 truncate">
                          {activity.topic_name || activity.subtopic_name}
                        </p>
                        <p className="text-xs text-dark-500 mt-0.5">
                          {new Date(activity.created_at).toLocaleDateString()} {new Date(activity.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-dark-400 mb-3">
                    No activity yet
                  </p>
                  <Button 
                    variant="secondary"
                    size="sm"
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
        <div className="p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-premium mb-3">
            💡 Tips for Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
              <p className="text-xs sm:text-sm font-medium text-blue-400 mb-1">Practice Daily</p>
              <p className="text-xs text-blue-300">Keep your streak alive with consistent daily practice to improve your SAT math skills.</p>
            </div>
            <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
              <p className="text-xs sm:text-sm font-medium text-purple-400 mb-1">Watch Tutorials</p>
              <p className="text-xs text-purple-300">Learn different approaches and techniques through our comprehensive tutorial library.</p>
            </div>
            <div className="p-3 bg-green-900/20 rounded-lg border border-green-800/30">
              <p className="text-xs sm:text-sm font-medium text-green-400 mb-1">Build Your Village</p>
              <p className="text-xs text-green-300">Grow your village as you practice and reach new milestones in your learning journey.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
