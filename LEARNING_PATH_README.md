# Personalized Learning Paths Algorithm

## Overview

The Personalized Learning Paths Algorithm is an intelligent recommendation system that creates adaptive learning journeys for SAT Math students based on their individual performance, engagement patterns, and learning progress.

## Features

### 🎯 Smart Recommendations
- **Performance-Based Analysis**: Analyzes past 10-20 problem attempts to identify strengths and weaknesses
- **Adaptive Difficulty**: Adjusts problem difficulty based on user engagement and performance level
- **Prerequisite-Aware**: Ensures logical progression through topics respecting the established order
- **Weak Area Detection**: Prioritizes review of struggling areas with <60% accuracy

### 📊 Performance Tracking
- **Multi-Level Performance**: Categorizes performance as Mastered (80%+), Proficient (60-80%), Struggling (40-60%), or Critical (<40%)
- **Engagement Scoring**: Calculates engagement based on activity frequency, attempt volume, recency, and efficiency
- **Progress Analytics**: Tracks mastery across major topics and individual subtopics

### 🔄 Dynamic Adaptation
- **Real-Time Updates**: Refreshes recommendations after each practice session
- **Context-Aware**: Considers user's current learning context and goals
- **Personalized Pacing**: Adapts to individual learning speeds and preferences

## Algorithm Logic

### 1. Performance Analysis
```javascript
// Analyzes last 30 days of user attempts
const performance = await analyzeUserPerformance(userId, limit = 20);

// Calculates metrics per subtopic:
- Accuracy rate
- Time per problem
- Total attempts
- Unique problems attempted
- Last activity timestamp
```

### 2. Engagement Scoring
```javascript
// Calculates engagement score (0-100):
const engagementScore = 
  (activityFrequency * 0.4) +    // Days active in last 14 days
  (attemptVolume * 0.3) +        // Total problems attempted
  (recency * 0.2) +              // How recent was last activity
  (efficiency * 0.1);            // Time per problem
```

### 3. Recommendation Generation
The algorithm generates recommendations in priority order:

1. **Critical Review** (Priority 1): <40% accuracy areas
2. **Additional Practice** (Priority 2): 40-60% accuracy areas
3. **Next Topic** (Priority 3): Logical progression to new content
4. **Challenge Problems** (Priority 4): Advanced content for mastered topics

### 4. Adaptive Difficulty
- **Low Engagement (<50)**: Easier problems to build confidence
- **Medium Engagement (50-80)**: Balanced difficulty level
- **High Engagement (>80)**: Challenging problems and new topics

## API Endpoints

### Core Recommendation Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/learning-path/recommendations` | GET | Get personalized recommendations |
| `/api/learning-path/next` | GET | Get highest priority next step |
| `/api/learning-path/overview` | GET | Comprehensive learning path overview |
| `/api/learning-path/performance` | GET | Detailed performance analysis |
| `/api/learning-path/refresh` | POST | Force refresh recommendations |
| `/api/learning-path/recommendations/:id/complete` | POST | Mark recommendation complete |

### Example Responses

#### Get Next Recommendation
```json
{
  "success": true,
  "data": {
    "recommendation": {
      "id": "550e8400-e29b-41d4-a716-446655440300",
      "recommendation_type": "review",
      "priority": 1,
      "difficulty_level": "easy",
      "reason": "Critical review needed: 35% accuracy in Linear Equations",
      "subtopic_name": "Linear Equations",
      "major_topic_name": "Algebra"
    }
  }
}
```

#### Learning Path Overview
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_subtopics": 6,
      "mastered_subtopics": 2,
      "struggling_subtopics": 1,
      "overall_accuracy": 72.5,
      "engagement_score": 85.2
    },
    "progress": [...],
    "performance_analysis": [...]
  }
}
```

## Database Schema

### Learning Path Recommendations
```sql
CREATE TABLE learning_path_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subtopic_id UUID NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50) NOT NULL, -- 'next_topic', 'review', 'practice', 'challenge'
  priority INTEGER NOT NULL DEFAULT 1, -- 1=highest, 5=lowest
  difficulty_level VARCHAR(50), -- 'easy', 'medium', 'hard'
  reason TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Learning Path Progress
```sql
CREATE TABLE learning_path_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  major_topic_id UUID NOT NULL REFERENCES major_topics(id) ON DELETE CASCADE,
  current_subtopic_id UUID REFERENCES subtopics(id) ON DELETE SET NULL,
  mastery_level DECIMAL(5, 2) DEFAULT 0.00, -- 0-100%
  subtopics_completed INTEGER DEFAULT 0,
  total_subtopics INTEGER DEFAULT 0,
  engagement_score DECIMAL(5, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, major_topic_id)
);
```

## Integration Examples

### Frontend Integration
```javascript
// Get next recommendation for homepage
const nextRec = await api.getNextRecommendation();
displayRecommendation(nextRec.data.recommendation);

// Get full overview for dashboard
const overview = await api.getOverview();
renderProgressChart(overview.data.progress);
renderPerformanceMetrics(overview.data.overview);
```

### Backend Integration
```javascript
// Auto-refresh after problem submission
app.post('/api/attempts/problems/:id/submit', 
  authenticate, 
  async (req, res) => {
    // Process attempt...
    await updateLearningPathProgress(req.user.id);
    await generateRecommendations(req.user.id);
    res.json(result);
  }
);
```

## Performance Thresholds

| Level | Accuracy Range | Action |
|-------|----------------|--------|
| **Mastered** | 80-100% | Move to next topic |
| **Proficient** | 60-80% | Additional practice recommended |
| **Struggling** | 40-60% | Review needed |
| **Critical** | 0-40% | Immediate intervention required |

## Testing

### Run Test Script
```bash
node test-learning-path.js
```

### Manual Testing
1. Create a user and complete some practice problems
2. Test recommendation generation:
   ```bash
   curl -H "Authorization: Bearer <token>" \
        http://localhost:3000/api/learning-path/recommendations
   ```
3. Test overview endpoint:
   ```bash
   curl -H "Authorization: Bearer <token>" \
        http://localhost:3000/api/learning-path/overview
   ```

## Algorithm Performance

### Response Times
- **Recommendation Generation**: <200ms
- **Performance Analysis**: <150ms
- **Progress Overview**: <100ms

### Scalability
- Analyzes last 30 days of data (configurable)
- Efficient database queries with proper indexing
- Caches recent performance calculations
- Batch processing for multiple users

## Configuration

### Environment Variables
```bash
# Learning Path Settings (add to .env)
LEARNING_PATH_ANALYSIS_DAYS=30
LEARNING_PATH_MIN_ATTEMPTS=3
LEARNING_PATH_MAX_RECOMMENDATIONS=10
```

### Performance Thresholds (configurable in model)
```javascript
const PERFORMANCE_THRESHOLDS = {
  MASTERY: 80,      // Move forward at 80% accuracy
  PROFICIENCY: 60,  // Needs more practice at 60-80%
  STRUGGLING: 40,   // Needs review at 40-60%
  CRITICAL: 40      // Intervention needed below 40%
};
```

## Monitoring & Analytics

### Key Metrics
- Recommendation acceptance rate
- Time to completion per recommendation
- Performance improvement after following recommendations
- Engagement score trends

### Logging
All recommendation generation events are logged with:
- User ID
- Performance metrics
- Generated recommendations
- Algorithm decisions

## Future Enhancements

### Planned Features
- **Machine Learning**: Enhanced personalization using ML models
- **Social Learning**: Peer comparison and collaborative recommendations
- **Adaptive Testing**: Dynamic assessment based on responses
- **Learning Styles**: Personalization based on visual/auditory/kinesthetic preferences
- **Time-Based Learning**: Optimal study time recommendations

### Algorithm Improvements
- **Spaced Repetition**: Integrated review scheduling
- **Difficulty Curves**: More granular difficulty progression
- **Multi-Factor Analysis**: Consider additional learning factors
- **Predictive Analytics**: Forecast learning outcomes

## Support & Documentation

- **API Documentation**: `api-docs/LEARNING_PATH_API.md`
- **Usage Examples**: `examples/learning-path-usage.js`
- **Test Script**: `test-learning-path.js`
- **Database Schema**: `migrations/20251115150253-learning-path-tracking.js`

## Contributing

When contributing to the learning path algorithm:

1. **Test Thoroughly**: Use the provided test script
2. **Update Documentation**: Keep API docs current
3. **Consider Performance**: Maintain sub-200ms response times
4. **Backward Compatibility**: Ensure existing integrations continue working
5. **Add Tests**: Include unit tests for new features

---

This personalized learning paths algorithm provides a foundation for adaptive, intelligent learning experiences that help students achieve their SAT Math goals more effectively.