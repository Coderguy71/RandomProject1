/**
 * Learning Path Algorithm Demonstration
 * Shows how the algorithm works with sample performance data
 */

// Mock data for demonstration
const mockUserData = {
  userId: '550e8400-e29b-41d4-a716-446655440001',
  recentAttempts: [
    // Linear Equations - Good performance
    { subtopic: 'Linear Equations', correct: 8, total: 10, avgTime: 45, lastAttempt: '2025-01-14' },
    
    // Quadratic Functions - Struggling
    { subtopic: 'Quadratic Functions', correct: 4, total: 10, avgTime: 120, lastAttempt: '2025-01-15' },
    
    // Exponential Functions - Critical
    { subtopic: 'Exponential Functions', correct: 2, total: 8, avgTime: 180, lastAttempt: '2025-01-13' },
    
    // Triangles - Mastered
    { subtopic: 'Triangles and Angles', correct: 9, total: 10, avgTime: 35, lastAttempt: '2025-01-15' },
    
    // Circles - Proficient
    { subtopic: 'Circles', correct: 7, total: 10, avgTime: 60, lastAttempt: '2025-01-14' },
    
    // Solid Geometry - Not attempted yet
  ]
};

const subtopics = [
  { id: '1', name: 'Linear Equations', major: 'Algebra', order: 1 },
  { id: '2', name: 'Quadratic Functions', major: 'Algebra', order: 2 },
  { id: '3', name: 'Exponential Functions', major: 'Algebra', order: 3 },
  { id: '4', name: 'Triangles and Angles', major: 'Geometry', order: 1 },
  { id: '5', name: 'Circles', major: 'Geometry', order: 2 },
  { id: '6', name: 'Solid Geometry', major: 'Geometry', order: 3 }
];

// Performance thresholds
const THRESHOLDS = {
  MASTERY: 80,
  PROFICIENCY: 60,
  STRUGGLING: 40,
  CRITICAL: 40
};

// Recommendation types
const RECOMMENDATION_TYPES = {
  NEXT_TOPIC: 'next_topic',
  REVIEW: 'review',
  PRACTICE: 'practice',
  CHALLENGE: 'challenge'
};

// Priority levels (1=highest, 5=lowest)
const PRIORITY = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  LOWEST: 5
};

// Calculate performance level
function getPerformanceLevel(accuracy) {
  if (accuracy >= THRESHOLDS.MASTERY) return 'mastered';
  if (accuracy >= THRESHOLDS.PROFICIENCY) return 'proficient';
  if (accuracy >= THRESHOLDS.STRUGGLING) return 'struggling';
  return 'critical';
}

// Calculate engagement score
function calculateEngagementScore(attempts) {
  const activeDays = 7; // Active 7 of last 14 days
  const totalAttempts = attempts.reduce((sum, a) => sum + a.total, 0);
  const avgTime = attempts.reduce((sum, a) => sum + a.avgTime, 0) / attempts.length;
  const lastActivity = 1; // 1 day since last activity
  
  let engagementScore = 0;
  
  // Activity frequency (40%)
  engagementScore += Math.min((activeDays / 14) * 40, 40);
  
  // Attempt volume (30%)
  engagementScore += Math.min((totalAttempts / 50) * 30, 30);
  
  // Recency (20%)
  const recencyScore = Math.max(0, 14 - lastActivity) / 14;
  engagementScore += recencyScore * 20;
  
  // Time per problem (10%) - lower is better
  const timeScore = Math.max(0, 10 - (avgTime / 60));
  engagementScore += Math.max(0, timeScore);
  
  return parseFloat(engagementScore.toFixed(2));
}

// Generate recommendations based on performance
function generateRecommendations(performance, engagementScore) {
  const recommendations = [];
  const attemptedSubtopics = new Set(performance.map(p => p.subtopic));
  
  // 1. Critical areas needing immediate review
  const criticalAreas = performance.filter(p => p.performanceLevel === 'critical');
  criticalAreas.forEach(area => {
    recommendations.push({
      type: RECOMMENDATION_TYPES.REVIEW,
      priority: PRIORITY.CRITICAL,
      difficulty: 'easy',
      reason: `Critical review needed: ${area.accuracy}% accuracy in ${area.subtopic}`
    });
  });
  
  // 2. Struggling areas needing practice
  const strugglingAreas = performance.filter(p => p.performanceLevel === 'struggling');
  strugglingAreas.forEach(area => {
    recommendations.push({
      type: RECOMMENDATION_TYPES.PRACTICE,
      priority: PRIORITY.HIGH,
      difficulty: 'easy',
      reason: `Additional practice needed: ${area.accuracy}% accuracy in ${area.subtopic}`
    });
  });
  
  // 3. Next unattempted topics
  const unattempted = subtopics.filter(s => !attemptedSubtopics.has(s.name));
  unattempted.forEach(topic => {
    recommendations.push({
      type: RECOMMENDATION_TYPES.NEXT_TOPIC,
      priority: PRIORITY.MEDIUM,
      difficulty: engagementScore > 70 ? 'medium' : 'easy',
      reason: `Next topic to explore: ${topic.name}`
    });
  });
  
  // 4. Challenge problems for mastered topics
  if (engagementScore > 80) {
    const masteredAreas = performance.filter(p => p.performanceLevel === 'mastered');
    masteredAreas.forEach(area => {
      recommendations.push({
        type: RECOMMENDATION_TYPES.CHALLENGE,
        priority: PRIORITY.LOW,
        difficulty: 'hard',
        reason: `Challenge problems for mastered topic: ${area.subtopic}`
      });
    });
  }
  
  // Sort by priority
  recommendations.sort((a, b) => a.priority - b.priority);
  
  return recommendations;
}

// Main demonstration
function demonstrateLearningPathAlgorithm() {
  console.log('🎯 Personalized Learning Paths Algorithm Demonstration\n');
  
  // Process performance data
  const performance = mockUserData.recentAttempts.map(attempt => {
    const accuracy = (attempt.correct / attempt.total) * 100;
    return {
      subtopic: attempt.subtopic,
      accuracy: parseFloat(accuracy.toFixed(2)),
      performanceLevel: getPerformanceLevel(accuracy),
      totalAttempts: attempt.total,
      avgTime: attempt.avgTime,
      lastAttempt: attempt.lastAttempt,
      needsReview: accuracy < THRESHOLDS.PROFICIENCY && attempt.total >= 3
    };
  });
  
  // Calculate engagement score
  const engagementScore = calculateEngagementScore(mockUserData.recentAttempts);
  
  // Generate recommendations
  const recommendations = generateRecommendations(performance, engagementScore);
  
  // Display results
  console.log('📊 Performance Analysis:');
  performance.forEach(p => {
    const emoji = p.performanceLevel === 'mastered' ? '✅' : 
                  p.performanceLevel === 'proficient' ? '🟡' :
                  p.performanceLevel === 'struggling' ? '🟠' : '🔴';
    console.log(`  ${emoji} ${p.subtopic}: ${p.accuracy}% accuracy (${p.performanceLevel})`);
  });
  console.log();
  
  console.log('🔥 Engagement Score:', engagementScore + '/100');
  console.log();
  
  console.log('🎯 Generated Recommendations:');
  recommendations.forEach((rec, index) => {
    const priorityEmoji = rec.priority === 1 ? '🚨' : 
                         rec.priority === 2 ? '⚠️' :
                         rec.priority === 3 ? '📍' :
                         rec.priority === 4 ? '🏆' : '💡';
    
    const typeEmoji = rec.type === 'review' ? '📚' :
                      rec.type === 'practice' ? '📝' :
                      rec.type === 'next_topic' ? '🆕' : '🚀';
    
    console.log(`  ${index + 1}. ${priorityEmoji} ${typeEmoji} Priority ${rec.priority}: ${rec.reason}`);
    console.log(`     Type: ${rec.type}, Difficulty: ${rec.difficulty}`);
  });
  console.log();
  
  console.log('📈 Algorithm Insights:');
  
  // Performance insights
  const avgAccuracy = performance.reduce((sum, p) => sum + p.accuracy, 0) / performance.length;
  console.log(`  • Overall accuracy: ${avgAccuracy.toFixed(1)}%`);
  
  const masteredCount = performance.filter(p => p.performanceLevel === 'mastered').length;
  const strugglingCount = performance.filter(p => p.needsReview).length;
  console.log(`  • Mastered topics: ${masteredCount}/${performance.length}`);
  console.log(`  • Topics needing review: ${strugglingCount}`);
  
  // Engagement insights
  if (engagementScore >= 80) {
    console.log('  • High engagement! Ready for challenging content.');
  } else if (engagementScore >= 50) {
    console.log('  • Good engagement. Focus on consistency.');
  } else {
    console.log('  • Low engagement. Consider easier content to build confidence.');
  }
  
  // Next step recommendation
  if (recommendations.length > 0) {
    const nextRec = recommendations[0];
    console.log(`  • Immediate next step: ${nextRec.reason}`);
  }
  console.log();
  
  console.log('🔧 Algorithm Features Demonstrated:');
  console.log('  ✓ Performance-based analysis');
  console.log('  ✓ Weak area identification');
  console.log('  ✓ Priority-based recommendations');
  console.log('  ✓ Adaptive difficulty selection');
  console.log('  ✓ Engagement-aware suggestions');
  console.log('  ✓ Logical topic progression');
  console.log();
  
  console.log('📋 Recommendation Priority System:');
  console.log('  1. Critical (<40% accuracy) - Immediate review needed');
  console.log('  2. High (40-60% accuracy) - Additional practice');
  console.log('  3. Medium - Next logical topic');
  console.log('  4. Low - Challenge problems');
  console.log('  5. Lowest - Optional content');
  console.log();
  
  console.log('🎓 Learning Path Strategy:');
  console.log('  1. Address critical weaknesses first');
  console.log('  2. Practice struggling areas to proficiency');
  console.log('  3. Progress to new topics when ready');
  console.log('  4. Challenge mastered topics for growth');
  console.log('  5. Adapt based on engagement and performance');
}

// Run the demonstration
if (require.main === module) {
  demonstrateLearningPathAlgorithm();
}

module.exports = {
  demonstrateLearningPathAlgorithm,
  generateRecommendations,
  calculateEngagementScore,
  getPerformanceLevel
};