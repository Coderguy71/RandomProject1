# SAT Math Learning Platform - Database Schema Documentation

## Overview

This document describes the complete PostgreSQL database schema for the SAT Math Learning Platform MVP. The schema is designed to support user learning progress tracking, practice problems, community interaction, and gamification features (village state).

## Schema Design Principles

1. **Normalization**: All tables follow 3NF (Third Normal Form) to minimize data redundancy
2. **Foreign Keys**: All relationships use CASCADE DELETE for data integrity
3. **Indexes**: Strategic indexes on frequently queried columns for performance
4. **Timestamps**: All tables include `created_at` and `updated_at` fields with automatic triggers
5. **UUIDs**: All primary keys use UUID v4 for distributed uniqueness
6. **JSONB**: JSON storage for flexible data like quiz options and village resources

## Core Tables

### 1. **users**
Stores user account information. This table is created in the initial schema migration.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| username | VARCHAR(100) | UNIQUE, NOT NULL | Display username |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| first_name | VARCHAR(100) | | User's first name |
| last_name | VARCHAR(100) | | User's last name |
| role | VARCHAR(50) | DEFAULT 'student' | User role (student, admin) |
| is_active | BOOLEAN | DEFAULT true | Account active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**: `idx_users_email`, `idx_users_username`

---

### 2. **major_topics**
Top-level categories for SAT math curriculum.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique topic identifier |
| name | VARCHAR(255) | NOT NULL | Topic name (e.g., "Algebra") |
| description | TEXT | | Topic description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**: `idx_major_topics_name`

**Sample Data**: Algebra, Geometry

---

### 3. **subtopics**
Subdivisions of major topics for granular learning paths.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique subtopic identifier |
| major_topic_id | UUID | FK → major_topics | Parent topic reference |
| name | VARCHAR(255) | NOT NULL | Subtopic name |
| description | TEXT | | Detailed description |
| tutorial_video_url | VARCHAR(1000) | | URL to tutorial video |
| order_index | INTEGER | DEFAULT 0 | Display order within major topic |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**: `idx_subtopics_major_topic_id`, `idx_subtopics_name`

**Sample Data**: 3 subtopics per major topic (6 total)
- Algebra: Linear Equations, Quadratic Functions, Exponential and Logarithmic Functions
- Geometry: Triangles and Angles, Circles, Solid Geometry

---

### 4. **tutorials**
Educational content for each subtopic.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique tutorial identifier |
| subtopic_id | UUID | FK → subtopics | Parent subtopic reference |
| title | VARCHAR(500) | NOT NULL | Tutorial title |
| content | TEXT | | Tutorial body content (markdown) |
| video_url | VARCHAR(1000) | | Embedded or linked video URL |
| order_index | INTEGER | DEFAULT 0 | Display order within subtopic |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**: `idx_tutorials_subtopic_id`, `idx_tutorials_order`

---

### 5. **practice_problems**
SAT math practice questions with multiple choice answers.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique problem identifier |
| subtopic_id | UUID | FK → subtopics | Associated subtopic |
| question_text | TEXT | NOT NULL | Full question text |
| options | JSONB | NOT NULL | Multiple choice options as JSON {A: "...", B: "...", ...} |
| correct_answer | VARCHAR(255) | NOT NULL | Correct answer key (A, B, C, or D) |
| explanation | TEXT | | Detailed explanation of solution |
| difficulty_level | VARCHAR(50) | | Difficulty (easy, medium, hard) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**: `idx_practice_problems_subtopic_id`, `idx_practice_problems_difficulty_level`

**Sample Data**: 9 practice problems across all subtopics

---

### 6. **user_progress**
Tracks each user's progress on specific subtopics.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique progress record |
| user_id | UUID | FK → users | User reference |
| subtopic_id | UUID | FK → subtopics | Subtopic reference |
| problems_completed | INTEGER | DEFAULT 0 | Number of problems solved |
| accuracy_rate | DECIMAL(5,2) | DEFAULT 0.00 | Percentage correct (0-100) |
| last_accessed | TIMESTAMP | | When subtopic was last viewed |
| streak_days | INTEGER | DEFAULT 0 | Consecutive days practicing |
| last_streak_updated | TIMESTAMP | | When streak was last updated |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Constraints**: UNIQUE(user_id, subtopic_id)

**Indexes**: `idx_user_progress_user_id`, `idx_user_progress_subtopic_id`, `idx_user_progress_user_subtopic`

---

### 7. **user_attempts**
Individual records of each attempt at a practice problem.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique attempt record |
| user_id | UUID | FK → users | User who attempted |
| problem_id | UUID | FK → practice_problems | Problem attempted |
| user_answer | VARCHAR(255) | NOT NULL | Selected answer (A, B, C, D) |
| is_correct | BOOLEAN | NOT NULL | Whether answer was correct |
| time_taken | INTEGER | | Seconds spent on problem |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Attempt timestamp |

**Indexes**: `idx_user_attempts_user_id`, `idx_user_attempts_problem_id`, `idx_user_attempts_user_problem`, `idx_user_attempts_created_at`

---

### 8. **learning_paths**
Tracks a user's overall learning journey and current position.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique learning path record |
| user_id | UUID | FK → users (UNIQUE) | One path per user |
| current_subtopic_id | UUID | FK → subtopics | Current learning position |
| status | VARCHAR(50) | DEFAULT 'in_progress' | Path status (in_progress, completed, paused) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Path creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**: `idx_learning_paths_user_id`, `idx_learning_paths_current_subtopic_id`, `idx_learning_paths_status`

---

### 9. **village_state**
Gamification feature - stores user's village status and resources.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique village record |
| user_id | UUID | FK → users (UNIQUE) | User's village |
| village_health | INTEGER | DEFAULT 100 | Village health percentage |
| resources | JSONB | DEFAULT {gold, gems, wood} | Village resources as JSON |
| decorations | JSONB | DEFAULT [] | Array of decorations |
| last_updated | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last interaction time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Village creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**: `idx_village_state_user_id`

**Example resources JSON**:
```json
{
  "gold": 1500,
  "gems": 25,
  "wood": 100
}
```

---

### 10. **community_posts**
Forum-like posts for user interaction.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique post identifier |
| user_id | UUID | FK → users | Post author |
| title | VARCHAR(500) | NOT NULL | Post title |
| content | TEXT | NOT NULL | Post content |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**: `idx_community_posts_user_id`, `idx_community_posts_created_at`

---

### 11. **community_replies**
Replies to community posts.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique reply identifier |
| post_id | UUID | FK → community_posts | Parent post |
| user_id | UUID | FK → users | Reply author |
| content | TEXT | NOT NULL | Reply content |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes**: `idx_community_replies_post_id`, `idx_community_replies_user_id`, `idx_community_replies_created_at`

---

## Entity Relationship Diagram

```
major_topics
    ↓ (one-to-many)
subtopics
    ↓ (one-to-many)
    ├─→ tutorials
    ├─→ practice_problems
    │       ↓ (one-to-many)
    │   user_attempts ←─ users
    │
    └─→ user_progress ←─ users
        ↓ (one-to-many)
    learning_paths ←─ users
        ↓ (one-to-one)
    users ←─ village_state (one-to-one)
        ↓ (one-to-many)
    community_posts
        ↓ (one-to-many)
    community_replies ←─ users
```

---

## Migration History

### Migration 1: Initial Schema (`20240101000001-initial-schema`)
Creates base infrastructure:
- `users` table with authentication fields
- `questions` table (legacy, may be deprecated)
- `audit_log` table for compliance
- UUID and pgcrypto extensions

### Migration 2: SAT Platform Schema (`20240102000001-sat-platform-schema`)
Creates all SAT platform specific tables:
- `major_topics`
- `subtopics`
- `tutorials`
- `practice_problems`
- `user_progress`
- `user_attempts`
- `learning_paths`
- `village_state`
- `community_posts`
- `community_replies`
- Automatic timestamp update triggers

### Migration 3: Sample Data (`20240103000001-sample-data`)
Populates sample data:
- 2 major topics (Algebra, Geometry)
- 3 subtopics per major topic
- 6 tutorials across subtopics
- 9 practice problems with various difficulty levels

---

## Performance Optimization

### Indexes Strategy
- **User lookups**: `idx_users_email`, `idx_users_username`
- **Topic navigation**: `idx_major_topics_name`, `idx_subtopics_name`
- **User progress tracking**: `idx_user_progress_user_id`, `idx_user_progress_user_subtopic`
- **Attempt history**: `idx_user_attempts_user_id`, `idx_user_attempts_created_at`
- **Community queries**: `idx_community_posts_created_at`, `idx_community_replies_created_at`

### Query Optimization
1. Use composite indexes for common WHERE + JOIN patterns
2. EXPLAIN ANALYZE for complex queries
3. Partition user_attempts table if reaches millions of rows
4. Archive old user_attempts records monthly

---

## Data Constraints

### Foreign Key Cascading
All foreign keys use `ON DELETE CASCADE` to ensure:
- Deleting a user removes all their data
- Deleting a major_topic removes subtopics and all related data
- Maintaining referential integrity automatically

### Unique Constraints
- `users.email` and `users.username` - Prevent duplicate accounts
- `user_progress(user_id, subtopic_id)` - One progress record per user per subtopic
- `learning_paths.user_id` - One learning path per user
- `village_state.user_id` - One village per user

---

## Backup and Recovery

1. **Daily backups**: `pg_dump sat_math_platform > backup_YYYYMMDD.sql`
2. **Point-in-time recovery**: Use WAL archiving for exact point recovery
3. **Full restore**: `psql sat_math_platform < backup_YYYYMMDD.sql`

---

## Future Enhancements

1. **Achievements table**: Track badges and milestones
2. **Leaderboard**: Materialized view for top performers
3. **AI Recommendations**: ML-based learning path suggestions
4. **Analytics**: Aggregate tables for BI queries
5. **Messaging**: Direct user-to-user messaging
6. **Collaborative problems**: Team-based challenges
7. **Exam simulations**: Full SAT-like test sessions

---

## Running Migrations

### Execute all migrations:
```bash
npm run db:migrate
```

### Rollback last migration:
```bash
npm run db:migrate:down
```

### Create new migration:
```bash
npm run db:migrate:create -- table_name
```

---

## Sample Queries

### Get user's progress on all subtopics:
```sql
SELECT 
  up.subtopic_id,
  s.name,
  up.problems_completed,
  up.accuracy_rate,
  up.streak_days
FROM user_progress up
JOIN subtopics s ON up.subtopic_id = s.id
WHERE up.user_id = 'user-uuid'
ORDER BY s.order_index;
```

### Get user's recent attempts:
```sql
SELECT 
  ua.id,
  pp.question_text,
  ua.user_answer,
  ua.is_correct,
  ua.time_taken,
  ua.created_at
FROM user_attempts ua
JOIN practice_problems pp ON ua.problem_id = pp.id
WHERE ua.user_id = 'user-uuid'
ORDER BY ua.created_at DESC
LIMIT 20;
```

### Get problems by subtopic and difficulty:
```sql
SELECT 
  id,
  question_text,
  difficulty_level,
  created_at
FROM practice_problems
WHERE subtopic_id = 'subtopic-uuid'
  AND difficulty_level = 'hard'
ORDER BY created_at;
```

---

## Version

- **Schema Version**: 1.0.0 (MVP)
- **Last Updated**: 2024-01-03
- **PostgreSQL Version**: 12+
