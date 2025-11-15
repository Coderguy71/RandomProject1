# Learning Path API Documentation

## Overview

The Personalized Learning Paths API provides intelligent recommendations based on user performance, engagement, and learning patterns. The algorithm analyzes past attempts to identify strengths, weaknesses, and optimal next steps for each student.

## Algorithm Details

### Performance Analysis
- Analyzes past 10-20 problem attempts (last 30 days)
- Calculates accuracy per subtopic
- Tracks time-per-problem trends
- Identifies performance levels: Mastered (80%+), Proficient (60-80%), Struggling (40-60%), Critical (<40%)

### Engagement Scoring
- **Activity Frequency** (40%): Days active in last 14 days
- **Attempt Volume** (30%): Total problems attempted
- **Recency** (20%): How recent was last activity
- **Time per Problem** (10%): Efficiency metric

### Recommendation Types
- **next_topic**: Next logical subtopic to explore
- **review**: Critical areas needing immediate attention
- **practice**: Areas needing additional work
- **challenge**: Advanced problems for mastered topics

### Priority System
1. **Critical** (Priority 1): <40% accuracy areas
2. **High** (Priority 2): 40-60% accuracy areas  
3. **Medium** (Priority 3): New topics
4. **Low** (Priority 4): Challenge problems
5. **Lowest** (Priority 5): Optional content

## API Endpoints

### GET /api/learning-path/recommendations
Get personalized learning recommendations based on current performance.

**Query Parameters:**
- `limit` (optional, default: 10) - Maximum number of recommendations to return

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "uuid",
        "recommendation_type": "review",
        "priority": 1,
        "difficulty_level": "easy",
        "reason": "Critical review needed: 35% accuracy in Linear Equations",
        "subtopic_id": "uuid",
        "subtopic_name": "Linear Equations",
        "major_topic_name": "Algebra",
        "created_at": "2025-01-15T10:30:00Z"
      }
    ],
    "message": "Personalized learning recommendations generated successfully"
  }
}
```

### GET /api/learning-path/overview
Get comprehensive learning path overview including progress, performance, and insights.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_subtopics": 6,
      "mastered_subtopics": 2,
      "struggling_subtopics": 1,
      "overall_accuracy": 72.5,
      "engagement_score": 85.2,
      "performance_thresholds": {
        "MASTERY": 80,
        "PROFICIENCY": 60,
        "STRUGGLING": 40,
        "CRITICAL": 40
      }
    },
    "progress": [
      {
        "major_topic_id": "uuid",
        "major_topic_name": "Algebra",
        "mastery_level": 75.0,
        "subtopics_completed": 2,
        "total_subtopics": 3,
        "engagement_score": 85.2
      }
    ],
    "performance_analysis": [
      {
        "subtopic_id": "uuid",
        "subtopic_name": "Linear Equations",
        "major_topic_name": "Algebra",
        "accuracy_rate": 85.0,
        "performance_level": "mastered",
        "needs_review": false,
        "total_attempts": 12
      }
    ],
    "performance_by_topic": {
      "Algebra": [
        {
          "subtopic_name": "Linear Equations",
          "accuracy_rate": 85.0,
          "performance_level": "mastered"
        }
      ]
    }
  }
}
```

### GET /api/learning-path/next
Get the single highest priority next recommendation.

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendation": {
      "id": "uuid",
      "recommendation_type": "review",
      "priority": 1,
      "difficulty_level": "easy",
      "reason": "Critical review needed: 35% accuracy in Linear Equations",
      "subtopic_name": "Linear Equations",
      "major_topic_name": "Algebra"
    },
    "message": "Next learning recommendation"
  }
}
```

### POST /api/learning-path/recommendations/:recommendationId/complete
Mark a recommendation as completed and generate new ones.

**Path Parameters:**
- `recommendationId` - UUID of the recommendation to complete

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendation": {
      "id": "uuid",
      "is_completed": true,
      "completed_at": "2025-01-15T11:00:00Z"
    },
    "message": "Recommendation marked as completed"
  }
}
```

### GET /api/learning-path/performance
Get detailed performance analysis with insights.

**Query Parameters:**
- `major_topic_id` (optional) - Filter by specific major topic

**Response:**
```json
{
  "success": true,
  "data": {
    "performance": [
      {
        "subtopic_id": "uuid",
        "subtopic_name": "Linear Equations",
        "major_topic_name": "Algebra",
        "accuracy_rate": 85.0,
        "performance_level": "mastered",
        "needs_review": false,
        "total_attempts": 12,
        "avg_time_taken": 45.2,
        "last_attempt_at": "2025-01-15T10:30:00Z"
      }
    ],
    "engagement_score": 85.2,
    "insights": [
      {
        "type": "positive",
        "message": "Excellent overall performance! You're mastering most topics."
      },
      {
        "type": "positive",
        "message": "High engagement! Your consistent practice is paying off."
      },
      {
        "type": "action",
        "message": "1 topic(s) need review. Focus on these first."
      }
    ]
  }
}
```

### POST /api/learning-path/refresh
Force refresh of all recommendations based on latest performance data.

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [...],
    "message": "Learning recommendations refreshed successfully"
  }
}
```

## Algorithm Logic Flow

1. **Performance Analysis**: Analyze last 30 days of attempts
2. **Engagement Calculation**: Compute engagement score based on recent activity
3. **Weak Area Identification**: Find subtopics with <60% accuracy
4. **Priority Assignment**: Rank recommendations by urgency
5. **Prerequisite Checking**: Ensure logical topic progression
6. **Difficulty Adaptation**: Adjust based on engagement and performance
7. **Recommendation Generation**: Create personalized learning path

## Performance Thresholds

- **Mastery**: 80%+ accuracy - Move to next topic
- **Proficiency**: 60-80% accuracy - Additional practice recommended
- **Struggling**: 40-60% accuracy - Review needed
- **Critical**: <40% accuracy - Immediate intervention required

## Integration with Existing Systems

The learning path algorithm integrates with:
- **User Attempts**: Analyzes performance data from `user_attempts` table
- **Progress Tracking**: Updates `learning_path_progress` table
- **Village System**: Considers engagement metrics from gamification
- **Problem Database**: Uses subtopic structure and problem metadata

## Testing

Use the provided test script to validate the algorithm:

```bash
node test-learning-path.js
```

This will demonstrate:
- Performance analysis across subtopics
- Engagement score calculation
- Recommendation generation
- Progress tracking updates

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `401` - Authentication required
- `404` - Recommendation not found
- `500` - Internal server error

Error responses follow the standard format:
```json
{
  "success": false,
  "error": "Error message description"
}
```