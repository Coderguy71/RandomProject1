# Character Tables Migration

## Overview
This document describes the character tables migration created for the SAT Math Learning Platform.

## Migration Files Created

1. **Migration Script**: `/migrations/20251117210239-create-character-tables.js`
   - Uses db-migrate framework
   - Reads SQL from separate up/down files

2. **SQL Up Migration**: `/migrations/sqls/create-character-tables-up.sql`
   - Creates `characters` table
   - Creates `character_skills` table
   - Adds indexes for performance

3. **SQL Down Migration**: `/migrations/sqls/create-character-tables-down.sql`
   - Drops both tables in reverse order

## Database Schema

### Characters Table
- `id` - SERIAL PRIMARY KEY (auto-incrementing integer)
- `user_id` - UUID NOT NULL UNIQUE, FK to users(id) ON DELETE CASCADE
- `character_name` - VARCHAR(255), default 'My Character'
- `level` - INTEGER, default 1
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Character Skills Table
- `id` - SERIAL PRIMARY KEY (auto-incrementing integer)
- `character_id` - INTEGER NOT NULL, FK to characters(id) ON DELETE CASCADE
- `skill_name` - VARCHAR(255) NOT NULL, must be one of: 'attack', 'speed', 'dexterity', 'luck', 'intelligence'
- `skill_level` - INTEGER DEFAULT 1
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- Unique constraint on (character_id, skill_name)

## Running the Migration

### Prerequisites
1. PostgreSQL database must be running
2. Database connection configured in `.env` file
3. All previous migrations must be applied

### Execute Migration
```bash
npm run db:migrate
```

This will run all pending migrations including the character tables migration.

### Rollback Migration (if needed)
```bash
npm run db:migrate:down
```

This will rollback the last migration.

## Verification

After running the migration, verify the tables exist:

```sql
-- List tables
\dt

-- Describe characters table
\d characters

-- Describe character_skills table
\d character_skills

-- Verify constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name IN ('characters', 'character_skills');
```

## Notes

- The old character system migration (20251117000001-character-system.js) has been renamed to .old to avoid conflicts
- This new migration uses INTEGER SERIAL IDs for the tables themselves, while maintaining UUID reference to users
- The character_skills table has a CHECK constraint to ensure only valid skill names are inserted
- Cascade deletion ensures that when a character is deleted, all associated skills are also deleted
- Cascade deletion from users ensures that when a user is deleted, their character is also deleted
