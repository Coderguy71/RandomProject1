import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, ProgressBar, Spinner, Badge, Tabs } from '../../components/ui';
import { analyticsAPI, villageAPI, learningPathAPI, attemptsAPI } from '../../services/apiServices';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [village, setVillage] = useState(null);
  const [nextRecommendation, setNextRecommendation] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [todayStats, setTodayStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsData, villageData, recommendationData, activityData] = await Promise.all([
        analyticsAPI.getOverview().catch(() => null),
        villageAPI.getVillageState().catch(() => null),
        learningPathAPI.getNextRecommendation().catch(() => null),
        attemptsAPI.getHistory({ limit: 5 }).catch(() => null),
      ]);

      setAnalytics(analyticsData?.data || analyticsData);
      setVillage(villageData?.data || villageData);
      setNextRecommendation(recommendationData?.data || recommendationData);
      
      if (activityData?.data?.data) {
        setRecentActivity(activityData.data.data);
      } else if (Array.isArray(activityData?.data)) {
        setRecentActivity(activityData.data);
      }

      calculateTodayStats(analyticsData?.data || analyticsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTodayStats = (data) => {
    if (!data) return;
    
    const today = new Date().toISOString().split('T')[0];
    const todayAttempts = recentActivity.filter(
      activity => activity.created_at?.split('T')[0] === today
    ).length;

    setTodayStats({
      problemsSolvedToday: todayAttempts,
      accuracy: data.summary?.overallAccuracy || 0,
      currentStreak: data.streak?.currentStreak || 0,
      villageLevel: village?.resources?.level || 1,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" variant="gradient" label="Loading your dashboard..." />
      </div>
    );
  }

  const stats = todayStats || {
    problemsSolvedToday: 0,
    accuracy: analytics?.summary?.overallAccuracy || 0,
    currentStreak: analytics?.streak?.currentStreak || 0,
    villageLevel: village?.resources?.level || 1,
  };

  const overallAccuracy = analytics?.summary?.overallAccuracy || 0;
  const totalProblemsAttempted = analytics?.summary?.uniqueProblemsAttempted || 0;
  const currentStreak = analytics?.streak?.currentStreak || 0;
  const longestStreak = analytics?.streak?.longestStreak || 0;
  const villageHealth = village?.resources?.health || 50;
  const villageLevel = village?.resources?.level || 1;

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
        {/* Problems Solved */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-primary-600/20 rounded-lg">
                <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <Badge variant="secondary" className="text-xs">Total</Badge>
            </div>
            <p className="text-xs sm:text-sm font-medium text-dark-400 mb-1.5">Problems Solved</p>
            <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-premium">
              {totalProblemsAttempted}
            </p>
            <p className="text-xs text-dark-500 mt-1.5">Lifetime: {analytics?.summary?.totalAttempts || 0} attempts</p>
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

        {/* Overall Accuracy */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-green-600/20 rounded-lg">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <Badge variant="secondary" className="text-xs">Accuracy</Badge>
            </div>
            <p className="text-xs sm:text-sm font-medium text-dark-400 mb-1.5">Overall Accuracy</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">{overallAccuracy.toFixed(1)}%</p>
            <ProgressBar 
              value={overallAccuracy} 
              max={100}
              className="mt-2.5"
              showLabel={false}
              striped
            />
          </div>
        </Card>

        {/* Village Health */}
        <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-purple-600/20 rounded-lg">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <Badge variant="secondary" className="text-xs">Level {villageLevel}</Badge>
            </div>
            <p className="text-xs sm:text-sm font-medium text-dark-400 mb-1.5">Village Health</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-400">{villageHealth}%</p>
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
        {/* Today's Activity & Your Village Preview */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Today's Activity Section */}
          <Card variant="default" className="border border-card-border/50">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-premium">
                  Today's Activity
                </h2>
                <Badge variant="secondary">
                  {stats.problemsSolvedToday} problems
                </Badge>
              </div>

              {/* Today's Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div className="p-4 bg-dark-800/50 rounded-lg border border-dark-700/50">
                  <p className="text-xs text-dark-400 mb-1">Problems Today</p>
                  <p className="text-2xl font-bold text-primary-400">{stats.problemsSolvedToday}</p>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-lg border border-dark-700/50">
                  <p className="text-xs text-dark-400 mb-1">Accuracy</p>
                  <p className="text-2xl font-bold text-green-400">{stats.accuracy.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-lg border border-dark-700/50">
                  <p className="text-xs text-dark-400 mb-1">Time Spent</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {analytics?.summary?.totalTimeSpent 
                      ? `${Math.round(analytics.summary.totalTimeSpent / 60)}m`
                      : '0m'
                    }
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate('/practice')}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Practice Now
                </Button>
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/analytics')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </Button>
              </div>
            </div>
          </Card>

          {/* Your Village Preview */}
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

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-5">
          {/* Next Recommended Topic */}
          <Card variant="gradient" className="border border-card-border/50">
            <div className="p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-3">
                Next Topic
              </h2>

              {nextRecommendation ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white/90">
                        {nextRecommendation.name || nextRecommendation.subtopic_name || 'Topic'}
                      </p>
                      <Badge 
                        variant="secondary"
                        className="text-xs"
                      >
                        {nextRecommendation.difficulty || 'Medium'}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/60">
                      {nextRecommendation.reason || 'Great choice to improve!'}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white/10 rounded-lg border border-white/20">
                    <p className="text-xs text-white/70 mb-0.5">Recommended Accuracy</p>
                    <p className="text-base font-bold text-white">
                      {nextRecommendation.recommended_accuracy ? `${nextRecommendation.recommended_accuracy}%` : 'N/A'}
                    </p>
                  </div>

                  <Button 
                    variant="ghost"
                    size="sm"
                    className="w-full text-white hover:bg-white/20 mt-2"
                    onClick={() => navigate('/practice')}
                  >
                    Start Learning
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-white/60 mb-3">
                    No recommendations yet
                  </p>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="w-full text-white hover:bg-white/20"
                    onClick={() => navigate('/practice')}
                  >
                    Start Practicing
                  </Button>
                </div>
              )}
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

      {/* Learning Progress by Topic */}
      {analytics?.topics?.status && (
        <Card variant="default" className="border border-card-border/50">
          <div className="p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-premium mb-4">
              Your Progress by Topic
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-900/20 to-green-900/5 rounded-lg border border-green-800/30">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs sm:text-sm font-medium text-green-400">Mastered</p>
                  <span className="text-xl sm:text-2xl font-bold text-green-400">{analytics.topics.status.counts.mastered}</span>
                </div>
                <p className="text-xs text-green-600">Topics you've mastered</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-900/20 to-yellow-900/5 rounded-lg border border-yellow-800/30">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs sm:text-sm font-medium text-yellow-400">In Progress</p>
                  <span className="text-xl sm:text-2xl font-bold text-yellow-400">{analytics.topics.status.counts.inProgress}</span>
                </div>
                <p className="text-xs text-yellow-600">Topics you're working on</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-900/20 to-red-900/5 rounded-lg border border-red-800/30">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs sm:text-sm font-medium text-red-400">Needs Work</p>
                  <span className="text-xl sm:text-2xl font-bold text-red-400">{analytics.topics.status.counts.weak}</span>
                </div>
                <p className="text-xs text-red-600">Topics to improve on</p>
              </div>
            </div>

            <div className="space-y-2">
              {analytics.topics.status.topics.mastered.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wide">Mastered</h3>
                  <div className="space-y-1.5">
                    {analytics.topics.status.topics.mastered.map((topic, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-dark-800/30 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-400">{topic.subtopicName}</p>
                          <p className="text-xs text-dark-500">{topic.problemsCompleted} problems</p>
                        </div>
                        <Badge variant="success" className="text-xs">
                          {topic.accuracyRate}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Quick Tips Section */}
      <Card variant="glass" className="border border-card-border/50">
        <div className="p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-premium mb-3">
            💡 Quick Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
              <p className="text-xs sm:text-sm font-medium text-blue-400 mb-1">Consistency is Key</p>
              <p className="text-xs text-blue-300">Practice regularly to maintain your streak and improve faster</p>
            </div>
            <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
              <p className="text-xs sm:text-sm font-medium text-purple-400 mb-1">Review Weak Topics</p>
              <p className="text-xs text-purple-300">Focus on areas where your accuracy needs improvement</p>
            </div>
            <div className="p-3 bg-orange-900/20 rounded-lg border border-orange-800/30">
              <p className="text-xs sm:text-sm font-medium text-orange-400 mb-1">Celebrate Wins</p>
              <p className="text-xs text-orange-300">Your progress matters - keep pushing towards your goals!</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
