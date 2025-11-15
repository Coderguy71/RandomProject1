# Village Gamification System

## Overview

The Village Gamification System is the core engagement mechanic that transforms SAT Math practice into an immersive village-building experience. Users earn resources, level up their village, unlock decorations, and achieve milestones through consistent practice.

## Key Features

### 🏘️ Village State Management
- **Village Health**: Dynamic metric (0-100) based on recent performance, activity, and streaks
- **Village Happiness**: Metric that can be influenced by decorations and achievements
- **Village Level**: Progression system that grows with experience points
- **Resources**: Three-type economy (Gold, Gems, Wood) for village upgrades
- **Experience Points**: Earned from practice and milestones, drives leveling

### 🔥 Streak Tracking
- **Current Streak**: Tracks consecutive days of practice
- **Longest Streak**: Records personal best streak
- **Automatic Updates**: Streaks update on every problem completion
- **Streak Bonuses**: Special rewards every 7 days (gold, gems, wood)
- **Streak Freeze**: Optional feature to protect streaks (tracks freeze count)

### 🎨 Decoration System
- **Decoration Catalog**: 10 pre-seeded decorations ranging from common to legendary
- **Unlock Requirements**: Higher rarity decorations require achievements
- **User Inventory**: Track owned decorations with quantities
- **Placement System**: Place decorations in village with X/Y coordinates
- **Decoration Types**: Trees, gardens, paths, fountains, statues, furniture, lighting, structures

### 🏆 Milestone & Achievement System
- **12 Pre-seeded Milestones**: 
  - Problems-based: First Steps, Quick Learner, Problem Solver, Math Master
  - Accuracy-based: Accurate Mind, Sharp Shooter, Perfectionist
  - Streak-based: Week Warrior, Monthly Master, Dedicated Student
  - Exploration: Topic Explorer
  - Speed: Speed Demon
- **Automatic Detection**: System checks and awards milestones after each problem
- **Rich Rewards**: Milestones grant resources and experience points
- **Progress Tracking**: View current progress toward unachieved milestones

### 📊 Village History
- **Event Logging**: Complete audit trail of village changes
- **Event Types**: problem_completed, decoration_purchased, decoration_placed, milestone_achieved, etc.
- **Pagination Support**: Efficiently browse history
- **Event Filtering**: Filter by event type

## Architecture

### Database Schema

#### Extended `village_state` Table
```sql
- village_health (INTEGER, 0-100)
- village_happiness (INTEGER, 0-100)
- village_level (INTEGER, starts at 1)
- experience_points (INTEGER)
- resources (JSONB: {gold, gems, wood})
- decorations (JSONB: array) - legacy, replaced by placements
- total_resources_earned (JSONB)
- total_resources_spent (JSONB)
```

#### New Tables
- `daily_streaks` - Streak tracking per user
- `village_decorations` - Catalog of available decorations
- `user_decorations` - User inventory
- `user_decoration_placements` - Placed decorations with positions
- `milestones` - Achievement definitions
- `user_milestones` - Achieved milestones per user
- `village_history` - Event log

### Models (Data Access Layer)

#### `villageModel.js`
- `getOrCreateVillageState(userId)` - Get/initialize village
- `updateVillageState(userId, updates)` - Update village properties
- `addResources(userId, resources)` - Add resources and track totals
- `spendResources(userId, resources)` - Spend with validation
- `addExperience(userId, xp)` - Add XP and auto-level
- `calculateVillageHealth(userId)` - Calculate health from stats

#### `streakModel.js`
- `getOrCreateStreak(userId)` - Get/initialize streak
- `updateStreak(userId)` - Update based on practice date
- `getStreakStats(userId)` - Get stats with practiced-today flag
- `freezeStreak(userId)` - Activate streak protection

#### `decorationModel.js`
- `getAvailableDecorations(filters)` - List catalog with filters
- `getDecorationById(decorationId)` - Get specific decoration
- `getUserDecorations(userId)` - Get user's inventory
- `addDecorationToInventory(userId, decorationId)` - Purchase/acquire
- `placeDecoration(userId, decorationId, x, y)` - Place in village
- `removePlacedDecoration(userId, placementId)` - Remove from village
- `updatePlacementPosition(userId, placementId, x, y)` - Move decoration

#### `milestoneModel.js`
- `getAllMilestones(filters)` - Get milestone catalog
- `getUserMilestones(userId)` - Get achieved milestones
- `checkAndAwardMilestones(userId)` - Check all & award eligible
- `getUserStats(userId)` - Get stats for milestone checking
- `getMilestonesWithProgress(userId)` - Milestones + user progress

#### `villageHistoryModel.js`
- `logVillageEvent(userId, type, description, changes)` - Log event
- `getVillageHistory(userId, limit, offset)` - Paginated history
- `getVillageHistoryByType(userId, eventType)` - Filtered history
- `getRecentActivitySummary(userId, days)` - Activity summary

### Controller (`villageController.js`)

Handles all village-related HTTP requests:
- Village state retrieval
- Decoration browsing and purchasing
- Decoration placement management
- Milestone progress viewing
- Streak information
- Village history viewing

### Routes (`/api/village`)

RESTful endpoints for village management. All routes require authentication.

See `api-docs/VILLAGE_API.md` for complete endpoint documentation.

## Integration with Practice System

### Automatic Updates on Problem Completion

When a user submits an answer via `POST /api/attempts/problems/:id/submit`, the system automatically:

1. **Awards Resources**:
   - Gold: 10/15/20 (easy/medium/hard) if correct, 2/3/4 if wrong
   - Wood: 2/3/4 (easy/medium/hard) if correct
   - XP: 20/30/40 (easy/medium/hard) if correct, 5/7.5/10 if wrong
   - Speed Bonus: +5 gold, +10 XP if completed under 2 minutes

2. **Updates Streak**:
   - Checks last practice date
   - Increments streak if consecutive day
   - Resets to 1 if gap (unless frozen)
   - Awards streak bonuses every 7 days

3. **Checks Milestones**:
   - Evaluates all unachieved milestones
   - Awards eligible milestones
   - Grants milestone rewards (resources + XP)
   - Logs milestone achievements

4. **Recalculates Village Health**:
   - Based on last 7 days accuracy
   - Recent problem count
   - Current streak
   - Updates village state if changed

5. **Logs History**:
   - Records problem completion event
   - Includes rewards and outcomes
   - Maintains complete audit trail

### Response Format

The submit answer response includes a `village_rewards` object:

```json
{
  "village_rewards": {
    "resources": {
      "gold": 15,
      "gems": 0,
      "wood": 3
    },
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

## Resource Economy

### Gold (Primary Currency)
- **Earning**: 10-20 per correct problem, 2-4 per wrong problem
- **Uses**: Most decoration purchases (30-1000 gold)
- **Bonuses**: Speed bonus (+5), streak bonuses (every 7 days)

### Gems (Premium Currency)
- **Earning**: Milestones, streak bonuses (1 per week of streak)
- **Uses**: Rare and legendary decorations (5-50 gems)
- **Scarcity**: Harder to obtain, used for special items

### Wood (Building Resource)
- **Earning**: 2-4 per correct problem
- **Uses**: All decorations require some wood (5-100)
- **Bonuses**: Streak bonuses (every 7 days)

### Experience Points
- **Earning**: 20-40 per correct problem, milestones (50-2500 XP)
- **Uses**: Village leveling
- **Level Formula**: Level N requires (N × 100) XP
- **Benefits**: Tracking progression, potential future benefits

## Village Health Algorithm

Village health is calculated dynamically using this formula:

```javascript
Base Health: 50 points

+ Recent Accuracy (last 7 days): up to 30 points
  - Calculated as: accuracy_rate * 0.3
  - Example: 85% accuracy = 25.5 points

+ Recent Activity: up to 10 points
  - Calculated as: recent_problems * 2
  - Example: 5 problems = 10 points (capped)

+ Current Streak: up to 10 points
  - Calculated as: min(current_streak, 10)
  - Example: 7-day streak = 7 points

Total: 0-100 (clamped)
```

This encourages:
- **Accuracy**: Biggest impact (30 points)
- **Consistency**: Recent activity matters
- **Streaks**: Bonus for daily practice

## Decoration System

### Rarity Levels
- **Common**: Basic decorations, low cost, no requirements
- **Uncommon**: Moderate cost, basic requirements
- **Rare**: High cost, significant requirements
- **Legendary**: Very high cost, major achievements required

### Unlock Requirements

Decorations can require:
- `problems_completed`: Number of problems solved
- `accuracy_rate`: Minimum accuracy percentage
- `streak_days`: Minimum streak length

Example:
```json
{
  "name": "Golden Gate",
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
  }
}
```

### Pre-seeded Decorations

1. **Basic Tree** (common) - 50g, 10w
2. **Flower Bed** (common) - 30g, 5w
3. **Stone Path** (common) - 40g
4. **Fountain** (uncommon) - 200g, 5 gems, 20w - Requires 10 problems
5. **Statue** (rare) - 500g, 20 gems, 50w - Requires 50 problems, 70% accuracy
6. **Garden Bench** (common) - 75g, 15w
7. **Lamp Post** (common) - 60g, 8w
8. **Flag Pole** (uncommon) - 150g, 3 gems, 25w - Requires 7-day streak
9. **Cherry Blossom Tree** (rare) - 300g, 15 gems, 30w - Requires 25 problems, 80% accuracy
10. **Golden Gate** (legendary) - 1000g, 50 gems, 100w - Requires 100 problems, 85% accuracy, 30-day streak

## Milestone System

### Milestone Types

1. **Problems**: Based on total problems completed
2. **Accuracy**: Based on overall accuracy percentage
3. **Streak**: Based on consecutive practice days
4. **Exploration**: Based on subtopics practiced
5. **Speed**: Based on fast problem completions

### Requirement Criteria

Milestones use flexible JSONB criteria:

```json
{
  "problems_completed": 10,
  "accuracy_rate": 70,
  "streak_days": 7
}
```

All criteria must be met (AND logic).

### Pre-seeded Milestones

| Name | Type | Requirement | Rewards |
|------|------|-------------|---------|
| First Steps | Problems | 1 problem | 100g, 5 gems, 10w, 50 XP |
| Quick Learner | Problems | 10 problems | 250g, 10 gems, 25w, 100 XP |
| Problem Solver | Problems | 50 problems | 500g, 25 gems, 50w, 250 XP |
| Math Master | Problems | 100 problems | 1000g, 50 gems, 100w, 500 XP |
| Accurate Mind | Accuracy | 70% accuracy | 300g, 15 gems, 30w, 150 XP |
| Sharp Shooter | Accuracy | 85% accuracy | 600g, 30 gems, 60w, 300 XP |
| Perfectionist | Accuracy | 95% accuracy | 1200g, 60 gems, 120w, 600 XP |
| Week Warrior | Streak | 7 days | 400g, 20 gems, 40w, 200 XP |
| Monthly Master | Streak | 30 days | 1500g, 75 gems, 150w, 750 XP |
| Dedicated Student | Streak | 100 days | 5000g, 250 gems, 500w, 2500 XP |
| Topic Explorer | Exploration | 6 subtopics | 800g, 40 gems, 80w, 400 XP |
| Speed Demon | Speed | 10 fast completions | 350g, 18 gems, 35w, 175 XP |

## Usage Examples

### Get Village State
```javascript
GET /api/village
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "village": {
      "health": 85,
      "level": 3,
      "resources": { "gold": 1250, "gems": 25, "wood": 180 }
    },
    "streak": {
      "current_streak": 7,
      "is_practiced_today": true
    },
    "decorations": [...]
  }
}
```

### Purchase Decoration
```javascript
POST /api/village/decorations/{id}/purchase
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "decoration": { ... },
    "village": {
      "resources": { "gold": 1200, "gems": 25, "wood": 170 }
    }
  }
}
```

### Place Decoration
```javascript
POST /api/village/decorations/{id}/place
Authorization: Bearer <token>
Body: { "position_x": 10, "position_y": 15 }

Response:
{
  "success": true,
  "data": {
    "id": "placement-uuid",
    "position_x": 10,
    "position_y": 15,
    "placed_at": "2024-01-15T10:30:00Z"
  }
}
```

### View Milestones
```javascript
GET /api/village/milestones
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "name": "Quick Learner",
      "achieved": true,
      "achieved_at": "2024-01-10T14:20:00Z",
      "progress": {
        "problems_completed": 25,
        "accuracy_rate": 75
      }
    },
    {
      "name": "Problem Solver",
      "achieved": false,
      "progress": {
        "problems_completed": 25,
        "accuracy_rate": 75
      }
    }
  ]
}
```

## Frontend Integration Tips

1. **Initialize Village on Login**: Call `GET /api/village` after authentication
2. **Show Rewards**: Display `village_rewards` from problem submission responses
3. **Real-time Updates**: Update village state from submission response, don't re-fetch
4. **Progress Indicators**: Show milestone progress bars, decoration unlock status
5. **Streak Reminders**: Use `is_practiced_today` to show practice status
6. **Celebration Moments**: Animate resource gains, level-ups, milestone achievements
7. **Activity Feed**: Display recent `village_history` as news feed
8. **Locked Content**: Grey-out locked decorations with tooltip showing requirements

## Testing

See `api-docs/VILLAGE_API.md` for comprehensive API documentation and examples.

## Future Enhancements

Potential extensions to the village system:
- Village happiness mechanics affecting rewards
- Social features (visit friend's villages)
- Seasonal events and limited decorations
- Village themes/skins
- Animated decorations
- Pet/character system
- Mini-games within village
- Trading system for decorations
- Village competitions/leaderboards

## Files Modified/Created

### New Files
- `migrations/20251115142546-village-gamification-system.js`
- `migrations/sqls/20251115142546-village-gamification-system-up.sql`
- `migrations/sqls/20251115142546-village-gamification-system-down.sql`
- `src/models/villageModel.js`
- `src/models/streakModel.js`
- `src/models/decorationModel.js`
- `src/models/milestoneModel.js`
- `src/models/villageHistoryModel.js`
- `src/controllers/villageController.js`
- `src/routes/village.js`
- `api-docs/VILLAGE_API.md`
- `VILLAGE_SYSTEM_README.md`

### Modified Files
- `src/controllers/attemptController.js` - Added village integration
- `src/app.js` - Mounted village routes

## Summary

The Village Gamification System transforms SAT Math practice into an engaging, rewarding experience. Through automatic integration with the practice system, every problem solved contributes to village growth, resource accumulation, and achievement progress. The system encourages consistent practice through streaks, rewards mastery through milestones, and provides creative expression through decorations.
