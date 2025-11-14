# SAT Platform - Database Schema Setup Guide

## Quick Start

### 1. Prerequisites
- PostgreSQL 12 or higher
- Node.js 18+
- npm 9+
- Running database instance

### 2. Environment Setup
Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Configure your database connection:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sat_math_platform
NODE_ENV=development
```

### 3. Create Database
```bash
createdb sat_math_platform
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Migrations
Execute all migrations in order:

```bash
npm run db:migrate
```

This will:
1. Create initial schema (users, questions, audit_log)
2. Create SAT platform tables (major_topics, subtopics, practice_problems, etc.)
3. Insert sample data (2 major topics with 3 subtopics each)

### 6. Verify Schema
Connect to the database and verify tables were created:

```bash
psql sat_math_platform
```

Then run:
```sql
\dt  -- List all tables
\d users  -- Describe users table
```

Expected tables:
- users
- major_topics
- subtopics
- tutorials
- practice_problems
- user_progress
- user_attempts
- learning_paths
- village_state
- community_posts
- community_replies
- questions (legacy)
- audit_log

---

## Migration Management

### View Migration Status
```bash
npm run db:migrate:status
```

### Rollback Last Migration
```bash
npm run db:migrate:down
```

### Rollback Multiple Migrations
```bash
npm run db:migrate:down -- --count 2
```

### Create New Migration
To create a new migration for a new feature:

```bash
npm run db:migrate:create -- add_new_table
```

This creates:
- `migrations/YYYYMMDDHHMMSS-add_new_table.js`
- `migrations/sqls/YYYYMMDDHHMMSS-add_new_table-up.sql`
- `migrations/sqls/YYYYMMDDHHMMSS-add_new_table-down.sql`

### Migration File Structure
Each migration has:
- **Up** migration: `*-up.sql` - Applies changes
- **Down** migration: `*-down.sql` - Reverts changes
- **Runner**: `*.js` - Executes SQL files

---

## Schema Overview

### Core Learning Structure
```
major_topics (Algebra, Geometry)
  ├── subtopics (Linear Equations, Quadratic Functions, etc.)
  │     ├── tutorials (Step-by-step lessons)
  │     └── practice_problems (Quiz questions)
  ├── user_progress (Track learning per subtopic)
  └── user_attempts (Record each answer attempt)
```

### User Features
```
users (Account information)
  ├── learning_paths (Current learning position)
  ├── village_state (Gamification status)
  ├── community_posts (Forum discussions)
  └── community_replies (Post responses)
```

---

## Sample Data

The migration includes sample data:

### Major Topics
1. **Algebra** - Fundamental algebraic concepts
   - Linear Equations
   - Quadratic Functions
   - Exponential and Logarithmic Functions

2. **Geometry** - Geometric principles
   - Triangles and Angles
   - Circles
   - Solid Geometry

### Practice Problems
9 sample problems across difficulty levels:
- Easy: 2 problems
- Medium: 4 problems
- Hard: 3 problems

### Tutorials
6 sample tutorials showing the learning progression

---

## API Integration Points

Once schema is set up, the backend can:

### 1. User Management
```sql
-- Get user's progress
SELECT * FROM user_progress WHERE user_id = ?;

-- Track attempts
INSERT INTO user_attempts (user_id, problem_id, user_answer, is_correct, time_taken) VALUES (...);
```

### 2. Learning Path
```sql
-- Get current position
SELECT * FROM learning_paths WHERE user_id = ?;

-- Get next subtopic problems
SELECT * FROM practice_problems WHERE subtopic_id = ? LIMIT 10;
```

### 3. Progress Analytics
```sql
-- Calculate overall accuracy
SELECT AVG(accuracy_rate) FROM user_progress WHERE user_id = ?;

-- Get streak information
SELECT streak_days FROM user_progress WHERE user_id = ? AND subtopic_id = ?;
```

### 4. Gamification
```sql
-- Update village state
UPDATE village_state SET resources = ? WHERE user_id = ?;

-- Track health changes
UPDATE village_state SET village_health = ? WHERE user_id = ?;
```

### 5. Community
```sql
-- Get recent posts
SELECT * FROM community_posts ORDER BY created_at DESC LIMIT 10;

-- Get post replies
SELECT * FROM community_replies WHERE post_id = ? ORDER BY created_at;
```

---

## Performance Notes

### Indexes
All critical query paths have indexes:
- User email/username lookups
- User progress tracking
- Topic navigation
- Community queries
- Attempt history

### Query Recommendations
1. Use composite indexes for filters: `WHERE user_id AND subtopic_id`
2. Pagination for large result sets
3. Aggregate queries use EXPLAIN ANALYZE
4. Consider materialized views for dashboards

### Scaling Considerations
- `user_attempts` table will grow rapidly - consider archiving
- Add read replicas for analytics queries
- Use connection pooling (default: 2-10 connections)
- Monitor slow queries with PostgreSQL logs

---

## Troubleshooting

### Migration Fails
```bash
# Check migration status
npm run db:migrate:status

# Review error logs
# Check database.json configuration
# Verify database exists: psql -l
```

### Connection Issues
```bash
# Test database connection
psql -h localhost -U postgres -d sat_math_platform

# Check environment variables
cat .env | grep DB_

# Verify PostgreSQL is running
psql --version
```

### Reset Database (Development Only)
```bash
# Drop and recreate
dropdb sat_math_platform
createdb sat_math_platform
npm run db:migrate
```

### View Sample Data
```sql
-- List major topics
SELECT * FROM major_topics;

-- Show subtopics for Algebra
SELECT * FROM subtopics WHERE major_topic_id = (
  SELECT id FROM major_topics WHERE name = 'Algebra'
);

-- Count practice problems
SELECT COUNT(*) FROM practice_problems;

-- Show problem difficulties
SELECT difficulty_level, COUNT(*) FROM practice_problems GROUP BY difficulty_level;
```

---

## Data Validation

### Constraints Enforced
- Email uniqueness
- Username uniqueness
- Foreign key referential integrity
- One progress record per user per subtopic
- One learning path per user
- One village per user

### Timestamps
All tables include:
- `created_at` - Record creation time
- `updated_at` - Last modification time (auto-updated via trigger)

### Audit Trail
`audit_log` table tracks changes:
- Table name
- Operation (INSERT, UPDATE, DELETE)
- Record ID
- Old and new values
- Changed by user
- Timestamp

---

## Backup & Recovery

### Manual Backup
```bash
# Full database backup
pg_dump sat_math_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
pg_dump sat_math_platform | gzip > backup.sql.gz
```

### Restore from Backup
```bash
# Restore full database
psql sat_math_platform < backup_20240103_120000.sql

# Restore from compressed backup
gunzip -c backup.sql.gz | psql sat_math_platform
```

### Partial Recovery
```bash
# Backup specific table
pg_dump -t community_posts sat_math_platform > table_backup.sql

# Restore specific table
psql sat_math_platform < table_backup.sql
```

---

## Next Steps

1. **API Controllers**: Create controllers to interact with schema
2. **Service Layer**: Build business logic on top of database
3. **Data Validation**: Add input validation in API layer
4. **Caching**: Implement Redis for frequently accessed data
5. **Monitoring**: Set up database query monitoring
6. **Analytics**: Create materialized views for reports

---

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [db-migrate Documentation](https://db-migrate.readthedocs.io/)
- [UUID Best Practices](https://www.postgresql.org/docs/current/datatype-uuid.html)
- [JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)

---

## Support

For schema questions or issues:
1. Check DATABASE_SCHEMA.md for table structure
2. Review migration SQL files in migrations/sqls/
3. Check error logs: `npm run dev` shows connection issues
4. Verify PostgreSQL is accessible: `psql --version`

---

Last Updated: 2024-01-03
