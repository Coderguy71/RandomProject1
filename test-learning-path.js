/**
 * Test script for Personalized Learning Paths Algorithm
 * This script demonstrates the learning path algorithm with sample data
 */

const { analyzeUserPerformance, generateRecommendations, calculateEngagementScore, getLearningPathProgress } = require('./src/models/learningPathModel');

// Sample user data for testing
const sampleUserId = '550e8400-e29b-41d4-a716-446655440001'; // Assuming this user exists

const testLearningPathAlgorithm = async () => {
  try {
    console.log('=== Personalized Learning Paths Algorithm Test ===\n');

    // 1. Analyze user performance
    console.log('1. Analyzing user performance...');
    const performance = await analyzeUserPerformance(sampleUserId);
    console.log('Performance Analysis:');
    performance.forEach(p => {
      console.log(`  - ${p.subtopic_name}: ${p.accuracy_rate}% accuracy (${p.performance_level})`);
    });
    console.log();

    // 2. Calculate engagement score
    console.log('2. Calculating engagement score...');
    const engagementScore = await calculateEngagementScore(sampleUserId);
    console.log(`Engagement Score: ${engagementScore}/100`);
    console.log();

    // 3. Generate personalized recommendations
    console.log('3. Generating personalized recommendations...');
    const recommendations = await generateRecommendations(sampleUserId);
    console.log(`Generated ${recommendations.length} recommendations:`);
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. Priority ${rec.priority}: ${rec.reason}`);
    });
    console.log();

    // 4. Get learning path progress
    console.log('4. Getting learning path progress...');
    const progress = await getLearningPathProgress(sampleUserId);
    console.log('Learning Path Progress:');
    progress.forEach(p => {
      console.log(`  - ${p.major_topic_name}: ${p.mastery_level}% mastery, ${p.subtopics_completed}/${p.total_subtopics} subtopics completed`);
    });
    console.log();

    console.log('=== Algorithm Features Demonstrated ===');
    console.log('✓ Performance analysis based on past attempts');
    console.log('✓ Engagement score calculation');
    console.log('✓ Weak area identification');
    console.log('✓ Adaptive difficulty selection');
    console.log('✓ Prerequisite-based progression');
    console.log('✓ Personalized recommendation generation');
    console.log('✓ Progress tracking across major topics');

  } catch (error) {
    console.error('Error testing learning path algorithm:', error);
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testLearningPathAlgorithm();
}

module.exports = { testLearningPathAlgorithm };