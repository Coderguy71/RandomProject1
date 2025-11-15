# Village Gamification API Documentation

## Overview

The Village Gamification system is the core engagement mechanic of the SAT Math Learning Platform. Users earn resources, level up their village, unlock decorations, and achieve milestones through practice.

## Base URL

All village endpoints are prefixed with `/api/village`

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. Get Village State

Get the current state of the user's village including health, resources, level, and decorations.

**Endpoint:** `GET /api/village`

**Response:**
```json
{
  "success": true,
  "data": {
    "village": {
      "id": "uuid",
      "user_id": "uuid",
      "health": 85,
      "happiness": 100,
      "level": 5,
      "experience_points": 230,
      "resources": {
        "gold": 1250,
        "gems": 35,
        "wood": 180
      },
      "total_resources_earned": {
        "gold": 2500,
        "gems": 50,
        "wood": 300
      },
      "total_resources_spent": {
        "gold": 1250,
        "gems": 15,
        "wood": 120
      },
      "last_updated": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-01T08:00:00Z"
    },
    "streak": {
      "current_streak": 7,
      "longest_streak": 14,
      "is_practiced_today": true,
      "last_practice_date": "2024-01-15"
    },
    "decorations": [
      {
        "id": "placement-uuid",
        "decoration_id": "decoration-uuid",
        "name": "Fountain",
        "decoration_type": "decoration",
        "rarity": "uncommon",
        "position_x": 10,
        "position_y": 15,
        "placed_at": "2024-01-10T14:20:00Z"
      }
    ]
  }
}
```

---

### 2. Get Available Decorations

List all decorations available for purchase, with unlock status and affordability.

**Endpoint:** `GET /api/village/decorations`

**Query Parameters:**
- `decoration_type` (optional): Filter by type (tree, garden, decoration, etc.)
- `rarity` (optional): Filter by rarity (common, uncommon, rare, legendary)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Basic Tree",
      "description": "A simple tree to beautify your village",
      "decoration_type": "tree",
      "rarity": "common",
      "cost_resources": {
        "gold": 50,
        "gems": 0,
        "wood": 10
      },
      "unlock_requirement": null,
      "image_url": null,
      "can_afford": true,
      "is_unlocked": true,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Golden Gate",
      "description": "A magnificent golden entrance",
      "decoration_type": "structure",
      "rarity": "legendary",
      "cost_resources": {
        "gold": 1000,
        "gems": 50,
        "wood": 100
      },
      "unlock_requirement": {
        "problems_completed": 100,
        "accuracy_rate": 85,
        "streak_days": 30
      },
      "image_url": null,
      "can_afford": false,
      "is_unlocked": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 3. Get Owned Decorations

Get decorations currently in the user's inventory.

**Endpoint:** `GET /api/village/decorations/owned`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "decoration_id": "uuid",
      "quantity": 2,
      "acquired_at": "2024-01-10T12:00:00Z",
      "name": "Basic Tree",
      "description": "A simple tree to beautify your village",
      "decoration_type": "tree",
      "rarity": "common",
      "image_url": null
    }
  ]
}
```

---

### 4. Purchase Decoration

Purchase a decoration using village resources.

**Endpoint:** `POST /api/village/decorations/:id/purchase`

**Response:**
```json
{
  "success": true,
  "data": {
    "decoration": {
      "id": "uuid",
      "user_id": "uuid",
      "decoration_id": "uuid",
      "quantity": 1,
      "acquired_at": "2024-01-15T10:30:00Z"
    },
    "village": {
      "resources": {
        "gold": 1200,
        "gems": 35,
        "wood": 170
      }
    },
    "message": "Successfully purchased Basic Tree"
  },
  "message": "Successfully purchased Basic Tree"
}
```

**Error Responses:**
- `400`: Decoration is not available
- `403`: Decoration is locked (requirements not met)
- `404`: Decoration not found
- `500`: Insufficient resources

---

### 5. Place Decoration

Place a decoration in the village at specified coordinates.

**Endpoint:** `POST /api/village/decorations/:id/place`

**Request Body:**
```json
{
  "position_x": 10,
  "position_y": 15
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "placement-uuid",
    "user_id": "uuid",
    "decoration_id": "uuid",
    "position_x": 10,
    "position_y": 15,
    "placed_at": "2024-01-15T10:35:00Z",
    "updated_at": "2024-01-15T10:35:00Z"
  },
  "message": "Decoration placed successfully"
}
```

---

### 6. Remove Placed Decoration

Remove a decoration from the village (returns it to inventory).

**Endpoint:** `DELETE /api/village/decorations/placements/:placementId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "placement-uuid",
    "user_id": "uuid",
    "decoration_id": "uuid"
  },
  "message": "Decoration removed successfully"
}
```

---

### 7. Update Decoration Position

Move a placed decoration to new coordinates.

**Endpoint:** `PUT /api/village/decorations/placements/:placementId`

**Request Body:**
```json
{
  "position_x": 20,
  "position_y": 25
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "placement-uuid",
    "user_id": "uuid",
    "decoration_id": "uuid",
    "position_x": 20,
    "position_y": 25,
    "placed_at": "2024-01-15T10:35:00Z",
    "updated_at": "2024-01-15T10:40:00Z"
  },
  "message": "Decoration position updated"
}
```

---

### 8. Get Milestones

Get all milestones with current progress and achievement status.

**Endpoint:** `GET /api/village/milestones`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "First Steps",
      "description": "Complete your first practice problem",
      "milestone_type": "problems",
      "requirement_criteria": {
        "problems_completed": 1
      },
      "reward_resources": {
        "gold": 100,
        "gems": 5,
        "wood": 10
      },
      "reward_experience": 50,
      "icon_url": null,
      "created_at": "2024-01-01T00:00:00Z",
      "achieved": true,
      "achieved_at": "2024-01-05T09:15:00Z",
      "progress": {
        "problems_completed": 25,
        "accuracy_rate": 75,
        "streak_days": 7,
        "subtopics_completed": 3,
        "fast_completions": 5
      }
    },
    {
      "id": "uuid",
      "name": "Quick Learner",
      "description": "Complete 10 practice problems",
      "milestone_type": "problems",
      "requirement_criteria": {
        "problems_completed": 10
      },
      "reward_resources": {
        "gold": 250,
        "gems": 10,
        "wood": 25
      },
      "reward_experience": 100,
      "icon_url": null,
      "created_at": "2024-01-01T00:00:00Z",
      "achieved": true,
      "achieved_at": "2024-01-08T14:30:00Z",
      "progress": {
        "problems_completed": 25,
        "accuracy_rate": 75,
        "streak_days": 7,
        "subtopics_completed": 3,
        "fast_completions": 5
      }
    },
    {
      "id": "uuid",
      "name": "Problem Solver",
      "description": "Complete 50 practice problems",
      "milestone_type": "problems",
      "requirement_criteria": {
        "problems_completed": 50
      },
      "reward_resources": {
        "gold": 500,
        "gems": 25,
        "wood": 50
      },
      "reward_experience": 250,
      "icon_url": null,
      "created_at": "2024-01-01T00:00:00Z",
      "achieved": false,
      "achieved_at": null,
      "progress": {
        "problems_completed": 25,
        "accuracy_rate": 75,
        "streak_days": 7,
        "subtopics_completed": 3,
        "fast_completions": 5
      }
    }
  ]
}
```

---

### 9. Get Streak Information

Get current streak statistics.

**Endpoint:** `GET /api/village/streak`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "current_streak": 7,
    "longest_streak": 14,
    "last_practice_date": "2024-01-15",
    "streak_frozen": false,
    "freeze_count": 2,
    "created_at": "2024-01-01T08:00:00Z",
    "updated_at": "2024-01-15T09:30:00Z",
    "is_practiced_today": true
  }
}
```

---

### 10. Get Village History

Get history of village events and changes.

**Endpoint:** `GET /api/village/history`

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `page_size` (optional, default: 20, max: 100): Results per page
- `event_type` (optional): Filter by event type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "event_type": "problem_completed",
      "event_description": "Completed medium problem: correct",
      "changes": {
        "problem_id": "uuid",
        "is_correct": true,
        "rewards": {
          "gold": 15,
          "gems": 0,
          "wood": 3
        },
        "experience": 30
      },
      "village_state_snapshot": null,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid",
      "user_id": "uuid",
      "event_type": "decoration_purchased",
      "event_description": "Purchased Basic Tree",
      "changes": {
        "decoration_id": "uuid",
        "decoration_name": "Basic Tree",
        "cost": {
          "gold": 50,
          "gems": 0,
          "wood": 10
        }
      },
      "village_state_snapshot": null,
      "created_at": "2024-01-15T10:25:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

## Integration with Practice System

When a user submits an answer to a practice problem, the village system is automatically updated:

### Resource Rewards

Based on problem difficulty:
- **Easy**: 10 gold, 2 wood, 20 XP (if correct)
- **Medium**: 15 gold, 3 wood, 30 XP (if correct)
- **Hard**: 20 gold, 4 wood, 40 XP (if correct)

Wrong answers still earn partial rewards (20% of correct answer rewards).

### Bonus Rewards

- **Speed Bonus**: +5 gold, +10 XP if completed in under 2 minutes
- **Streak Bonus**: Every 7 days of streak: +14 gold, +1 gem per week, +7 wood

### Streak Updates

Streaks are automatically updated on problem completion:
- Same day practice: No change
- Next day practice: +1 to streak
- Missed day(s): Reset to 1

### Milestone Checks

After each problem completion, the system automatically:
1. Checks all milestone requirements
2. Awards newly earned milestones
3. Grants milestone rewards (resources and XP)
4. Updates village history

### Village Health Calculation

Village health (0-100) is calculated based on:
- **Recent Accuracy** (last 7 days): Up to 30 points
- **Recent Activity**: +2 points per problem (up to 10 points)
- **Current Streak**: Up to 10 points

---

## Event Types

Village history tracks these event types:

- `problem_completed`: User completed a practice problem
- `decoration_purchased`: User bought a decoration
- `decoration_placed`: User placed decoration in village
- `decoration_removed`: User removed decoration from village
- `milestone_achieved`: User earned a milestone
- `level_up`: Village leveled up
- `resources_earned`: Resources earned from events
- `resources_spent`: Resources spent on purchases

---

## Resource Economy

### Gold
- Primary currency
- Earned from all problem completions
- Used for most decoration purchases

### Gems
- Premium currency
- Earned from milestones and streak bonuses
- Required for rare/legendary decorations

### Wood
- Building resource
- Earned from problem completions
- Used for decoration purchases

### Experience Points (XP)
- Earned from problems and milestones
- Determines village level
- Level up every 100 XP * current level

---

## Error Codes

- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions or locked content)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error (insufficient resources, database error)

---

## Tips for Frontend Integration

1. **Village State**: Call `GET /api/village` on app load to sync state
2. **Real-time Updates**: After problem submission, check `village_rewards` in response
3. **Decorations**: Show locked decorations with greyed-out UI and requirement tooltips
4. **Milestones**: Display progress bars for unachieved milestones
5. **Streak Reminders**: Use `is_practiced_today` to show streak status
6. **History Feed**: Display recent village events as activity feed

---

## Example Flow: User Completes a Problem

1. User submits answer via `POST /api/attempts/problems/:id/submit`
2. Response includes `village_rewards`:
   ```json
   {
     "village_rewards": {
       "resources": { "gold": 15, "gems": 0, "wood": 3 },
       "experience": 30,
       "milestones": [
         {
           "milestone_name": "Quick Learner",
           "reward_resources": { "gold": 250, "gems": 10, "wood": 25 },
           "reward_experience": 100
         }
       ],
       "streak_updated": true,
       "current_streak": 8,
       "health_change": 5
     }
   }
   ```
3. Frontend shows reward animation and updates village display
4. If milestone achieved, show congratulations modal
5. Update resource counters and village health bar

---

## Version

- **API Version**: 1.0.0
- **Last Updated**: 2024-01-15
