const { sendSuccess, sendError } = require('../utils/response');
const {
  generateRecommendations,
  getUserRecommendations,
  getLearningPathProgress,
  analyzeUserPerformance,
  calculateEngagementScore,
  updateLearningPathProgress,
  markRecommendationCompleted,
  PERFORMANCE_THRESHOLDS
} = require('../models/learningPathModel');

const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    // Generate new recommendations based on current performance
    await generateRecommendations(userId);
    
    // Update learning path progress
    await updateLearningPathProgress(userId);

    // Get the recommendations
    const recommendations = await getUserRecommendations(userId, parseInt(limit));

    sendSuccess(res, {
      recommendations,
      message: 'Personalized learning recommendations generated successfully'
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    sendError(res, 'Failed to generate personalized recommendations', 500);
  }
};

const getLearningPathOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get learning path progress for all major topics
    const progress = await getLearningPathProgress(userId);
    
    // Get performance analysis
    const performance = await analyzeUserPerformance(userId);
    
    // Get engagement score
    const engagementScore = await calculateEngagementScore(userId);

    // Calculate overall statistics
    const totalSubtopics = performance.length;
    const masteredSubtopics = performance.filter(p => p.performance_level === 'mastered').length;
    const strugglingSubtopics = performance.filter(p => p.needs_review).length;
    const overallAccuracy = performance.length > 0 ? 
      performance.reduce((sum, p) => sum + p.accuracy_rate, 0) / performance.length : 0;

    // Group performance by major topic
    const performanceByTopic = {};
    performance.forEach(p => {
      if (!performanceByTopic[p.major_topic_name]) {
        performanceByTopic[p.major_topic_name] = [];
      }
      performanceByTopic[p.major_topic_name].push(p);
    });

    sendSuccess(res, {
      overview: {
        total_subtopics: totalSubtopics,
        mastered_subtopics: masteredSubtopics,
        struggling_subtopics: strugglingSubtopics,
        overall_accuracy: parseFloat(overallAccuracy.toFixed(2)),
        engagement_score: engagementScore,
        performance_thresholds: PERFORMANCE_THRESHOLDS
      },
      progress,
      performance_analysis: performance,
      performance_by_topic: performanceByTopic
    });
  } catch (error) {
    console.error('Error getting learning path overview:', error);
    sendError(res, 'Failed to get learning path overview', 500);
  }
};

const getNextRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the highest priority recommendation
    const recommendations = await getUserRecommendations(userId, 1);
    
    if (recommendations.length === 0) {
      // Generate new recommendations if none exist
      await generateRecommendations(userId);
      const newRecommendations = await getUserRecommendations(userId, 1);
      
      if (newRecommendations.length === 0) {
        return sendSuccess(res, {
          recommendation: null,
          message: 'No recommendations available at this time'
        });
      }
      
      return sendSuccess(res, {
        recommendation: newRecommendations[0],
        message: 'Next learning recommendation'
      });
    }

    sendSuccess(res, {
      recommendation: recommendations[0],
      message: 'Next learning recommendation'
    });
  } catch (error) {
    console.error('Error getting next recommendation:', error);
    sendError(res, 'Failed to get next recommendation', 500);
  }
};

const completeRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recommendationId } = req.params;

    const completedRecommendation = await markRecommendationCompleted(userId, recommendationId);
    
    if (!completedRecommendation) {
      return sendError(res, 'Recommendation not found or already completed', 404);
    }

    // Generate new recommendations after completing one
    await generateRecommendations(userId);

    sendSuccess(res, {
      recommendation: completedRecommendation,
      message: 'Recommendation marked as completed'
    });
  } catch (error) {
    console.error('Error completing recommendation:', error);
    sendError(res, 'Failed to complete recommendation', 500);
  }
};

const getPerformanceAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const { major_topic_id } = req.query;

    let performance = await analyzeUserPerformance(userId);
    
    if (major_topic_id) {
      performance = performance.filter(p => p.major_topic_id === major_topic_id);
    }

    // Get engagement score
    const engagementScore = await calculateEngagementScore(userId);

    // Identify trends and insights
    const insights = generatePerformanceInsights(performance, engagementScore);

    sendSuccess(res, {
      performance,
      engagement_score: engagementScore,
      insights
    });
  } catch (error) {
    console.error('Error getting performance analysis:', error);
    sendError(res, 'Failed to get performance analysis', 500);
  }
};

const generatePerformanceInsights = (performance, engagementScore) => {
  const insights = [];

  // Overall performance insights
  if (performance.length > 0) {
    const avgAccuracy = performance.reduce((sum, p) => sum + p.accuracy_rate, 0) / performance.length;
    
    if (avgAccuracy >= PERFORMANCE_THRESHOLDS.MASTERY) {
      insights.push({
        type: 'positive',
        message: 'Excellent overall performance! You\'re mastering most topics.'
      });
    } else if (avgAccuracy >= PERFORMANCE_THRESHOLDS.PROFICIENCY) {
      insights.push({
        type: 'neutral',
        message: 'Good progress! Keep practicing to reach mastery level.'
      });
    } else {
      insights.push({
        type: 'concern',
        message: 'Focus on understanding fundamentals before moving to advanced topics.'
      });
    }
  }

  // Engagement insights
  if (engagementScore >= 80) {
    insights.push({
      type: 'positive',
      message: 'High engagement! Your consistent practice is paying off.'
    });
  } else if (engagementScore >= 50) {
    insights.push({
      type: 'neutral',
      message: 'Good engagement level. Try to practice more consistently.'
    });
  } else {
    insights.push({
      type: 'concern',
      message: 'Low engagement detected. Regular practice will help improve your skills.'
    });
  }

  // Struggling areas
  const strugglingAreas = performance.filter(p => p.needs_review);
  if (strugglingAreas.length > 0) {
    insights.push({
      type: 'action',
      message: `${strugglingAreas.length} topic(s) need review. Focus on these first.`
    });
  }

  // Mastered areas
  const masteredAreas = performance.filter(p => p.performance_level === 'mastered');
  if (masteredAreas.length > 0) {
    insights.push({
      type: 'positive',
      message: `${masteredAreas.length} topic(s) mastered! Ready for challenges.`
    });
  }

  return insights;
};

const refreshRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Force regeneration of recommendations
    await generateRecommendations(userId);
    await updateLearningPathProgress(userId);

    const recommendations = await getUserRecommendations(userId, 10);

    sendSuccess(res, {
      recommendations,
      message: 'Learning recommendations refreshed successfully'
    });
  } catch (error) {
    console.error('Error refreshing recommendations:', error);
    sendError(res, 'Failed to refresh recommendations', 500);
  }
};

module.exports = {
  getPersonalizedRecommendations,
  getLearningPathOverview,
  getNextRecommendation,
  completeRecommendation,
  getPerformanceAnalysis,
  refreshRecommendations
};