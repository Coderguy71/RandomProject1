/**
 * Example Usage of Personalized Learning Paths API
 * This demonstrates how to integrate the learning path algorithm with user interactions
 */

// Example API calls using fetch (for frontend integration)

class LearningPathAPI {
  constructor(baseURL = 'http://localhost:3000/api', token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get personalized recommendations
  async getRecommendations(limit = 10) {
    return this.request(`/learning-path/recommendations?limit=${limit}`);
  }

  // Get learning path overview
  async getOverview() {
    return this.request('/learning-path/overview');
  }

  // Get next recommendation
  async getNextRecommendation() {
    return this.request('/learning-path/next');
  }

  // Complete a recommendation
  async completeRecommendation(recommendationId) {
    return this.request(`/learning-path/recommendations/${recommendationId}/complete`, {
      method: 'POST'
    });
  }

  // Get performance analysis
  async getPerformanceAnalysis(majorTopicId = null) {
    const endpoint = majorTopicId 
      ? `/learning-path/performance?major_topic_id=${majorTopicId}`
      : '/learning-path/performance';
    return this.request(endpoint);
  }

  // Refresh recommendations
  async refreshRecommendations() {
    return this.request('/learning-path/refresh', {
      method: 'POST'
    });
  }
}

// Example usage scenarios
async function demonstrateLearningPaths() {
  // Initialize API client (token would come from authentication)
  const api = new LearningPathAPI('http://localhost:3000/api', 'your-jwt-token');

  try {
    console.log('=== Learning Path API Usage Examples ===\n');

    // Scenario 1: New user onboarding
    console.log('1. New User Onboarding');
    console.log('Getting initial learning recommendations...');
    const initialRecommendations = await api.getRecommendations();
    console.log(`Received ${initialRecommendations.data.recommendations.length} recommendations`);
    
    if (initialRecommendations.data.recommendations.length > 0) {
      const firstRec = initialRecommendations.data.recommendations[0];
      console.log(`First recommendation: ${firstRec.reason}`);
    }
    console.log();

    // Scenario 2: Dashboard overview
    console.log('2. Student Dashboard');
    console.log('Loading learning path overview...');
    const overview = await api.getOverview();
    console.log(`Overall accuracy: ${overview.data.overview.overall_accuracy}%`);
    console.log(`Engagement score: ${overview.data.overview.engagement_score}/100`);
    console.log(`Mastered subtopics: ${overview.data.overview.mastered_subtopics}/${overview.data.overview.total_subtopics}`);
    console.log();

    // Scenario 3: Performance insights
    console.log('3. Performance Analysis');
    console.log('Analyzing performance patterns...');
    const performance = await api.getPerformanceAnalysis();
    console.log(`Performance insights:`);
    performance.data.insights.forEach(insight => {
      console.log(`  [${insight.type.toUpperCase()}] ${insight.message}`);
    });
    console.log();

    // Scenario 4: Next step guidance
    console.log('4. Next Learning Step');
    console.log('Getting next recommendation...');
    const nextRec = await api.getNextRecommendation();
    if (nextRec.data.recommendation) {
      const rec = nextRec.data.recommendation;
      console.log(`Next step: ${rec.recommendation_type} - ${rec.reason}`);
      console.log(`Topic: ${rec.subtopic_name} (${rec.major_topic_name})`);
      console.log(`Difficulty: ${rec.difficulty_level}`);
    } else {
      console.log('No recommendations available');
    }
    console.log();

    // Scenario 5: Completing a recommendation
    console.log('5. Recommendation Completion');
    if (initialRecommendations.data.recommendations.length > 0) {
      const firstRecId = initialRecommendations.data.recommendations[0].id;
      console.log(`Marking recommendation ${firstRecId} as completed...`);
      const completion = await api.completeRecommendation(firstRecId);
      console.log(`Status: ${completion.data.message}`);
    }
    console.log();

    // Scenario 6: Refresh recommendations after practice session
    console.log('6. Post-Practice Refresh');
    console.log('Refreshing recommendations after practice...');
    const refreshed = await api.refreshRecommendations();
    console.log(`Refreshed recommendations: ${refreshed.data.recommendations.length} new suggestions`);
    console.log();

    console.log('=== Integration Patterns ===');
    console.log('✓ Dashboard: Use /overview for comprehensive progress view');
    console.log('✓ Homepage: Use /next for immediate next step');
    console.log('✓ Practice Sessions: Use /recommendations for full list');
    console.log('✓ Analytics: Use /performance for detailed insights');
    console.log('✓ Post-Practice: Use /refresh to update recommendations');

  } catch (error) {
    console.error('Error in learning path API usage:', error);
  }
}

// Frontend integration example
class LearningPathComponent {
  constructor(api) {
    this.api = api;
    this.currentRecommendation = null;
  }

  // Load and display next recommendation
  async loadNextRecommendation() {
    try {
      const response = await this.api.getNextRecommendation();
      this.currentRecommendation = response.data.recommendation;
      this.renderRecommendation();
    } catch (error) {
      console.error('Failed to load recommendation:', error);
    }
  }

  // Render recommendation in UI
  renderRecommendation() {
    if (!this.currentRecommendation) {
      document.getElementById('recommendation').innerHTML = 
        '<p>No recommendations available at this time.</p>';
      return;
    }

    const rec = this.currentRecommendation;
    const html = `
      <div class="recommendation-card">
        <h3>${rec.subtopic_name}</h3>
        <p><strong>Topic:</strong> ${rec.major_topic_name}</p>
        <p><strong>Type:</strong> ${rec.recommendation_type}</p>
        <p><strong>Difficulty:</strong> ${rec.difficulty_level}</p>
        <p><strong>Reason:</strong> ${rec.reason}</p>
        <button onclick="startPractice('${rec.subtopic_id}')">Start Practice</button>
        <button onclick="completeRecommendation('${rec.id}')">Mark Complete</button>
      </div>
    `;
    
    document.getElementById('recommendation').innerHTML = html;
  }

  // Complete current recommendation
  async completeRecommendation(recommendationId) {
    try {
      await this.api.completeRecommendation(recommendationId);
      await this.loadNextRecommendation(); // Load next one
    } catch (error) {
      console.error('Failed to complete recommendation:', error);
    }
  }
}

// Backend integration example (Express middleware)
const learningPathMiddleware = {
  // Auto-refresh recommendations after problem submission
  async refreshAfterSubmission(req, res, next) {
    try {
      if (req.user && req.body.problemId) {
        // This would be called after a problem attempt
        const api = new LearningPathAPI('http://localhost:3000', req.token);
        await api.refreshRecommendations();
      }
      next();
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
      next();
    }
  },

  // Add learning context to problem requests
  async addLearningContext(req, res, next) {
    try {
      if (req.user) {
        const api = new LearningPathAPI('http://localhost:3000', req.token);
        const nextRec = await api.getNextRecommendation();
        req.learningContext = {
          currentRecommendation: nextRec.data.recommendation,
          suggestedDifficulty: nextRec.data.recommendation?.difficulty_level || 'medium'
        };
      }
      next();
    } catch (error) {
      console.error('Failed to load learning context:', error);
      next();
    }
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LearningPathAPI,
    LearningPathComponent,
    learningPathMiddleware,
    demonstrateLearningPaths
  };
}

// Run demonstration if executed directly
if (typeof window === 'undefined' && require.main === module) {
  demonstrateLearningPaths();
}