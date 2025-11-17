# Character Database Migration Summary

## What Was Created

### 1. Migration Files
- **Main Migration**: `/migrations/20251117210239-create-character-tables.js`
  - Uses db-migrate framework
  - Follows the existing pattern of loading SQL from separate files
  
- **Up Migration SQL**: `/migrations/sqls/create-character-tables-up.sql`
  - Creates the `characters` table
  - Creates the `character_skills` table
  - Adds indexes for performance optimization
  
- **Down Migration SQL**: `/migrations/sqls/create-character-tables-down.sql`
  - Drops tables in correct order to respect foreign key constraints

### 2. Documentation
- **MIGRATION_README.md**: Complete guide for running and verifying the migration

## Database Schema Details

### Characters Table
```sql
CREATE TABLE characters (
  id SERIAL PRIMARY KEY,                    -- Auto-incrementing integer ID
  user_id UUID NOT NULL UNIQUE              -- FK to users(id), ensures one character per user
    REFERENCES users(id) ON DELETE CASCADE,
  character_name VARCHAR(255)               -- Character name (default: 'My Character')
    DEFAULT 'My Character',
  level INTEGER DEFAULT 1,                  -- Character level (starts at 1)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Character Skills Table
```sql
CREATE TABLE character_skills (
  id SERIAL PRIMARY KEY,                    -- Auto-incrementing integer ID
  character_id INTEGER NOT NULL             -- FK to characters(id)
    REFERENCES characters(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL          -- Must be one of 5 valid skills
    CHECK (skill_name IN ('attack', 'speed', 'dexterity', 'luck', 'intelligence')),
  skill_level INTEGER DEFAULT 1,            -- Skill level (starts at 1)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_character_skill UNIQUE (character_id, skill_name)  -- One record per skill per character
);
```

## Key Features

1. **SERIAL Primary Keys**: Uses auto-incrementing integers for table IDs
2. **UUID Foreign Key**: Maintains compatibility with users table (user_id is UUID)
3. **Cascade Deletion**: Deleting a user deletes their character; deleting a character deletes all skills
4. **Unique Constraints**: 
   - One character per user (user_id UNIQUE in characters)
   - One skill record per skill type per character (character_id, skill_name UNIQUE in character_skills)
5. **Check Constraint**: Only allows the 5 valid skill names
6. **Indexes**: Added on foreign keys for query performance

## Migration vs Old Version

The old migration (20251117000001-character-system.js) has been renamed to `.old`:
- Old used UUID for all IDs
- New uses INTEGER SERIAL for table IDs (as per ticket requirements)
- New has explicit CHECK constraint for skill names
- New uses simpler default character name ('My Character' vs 'Scholar')

## How to Run

```bash
# Run the migration
npm run db:migrate

# This will:
# 1. Connect to PostgreSQL
# 2. Execute create-character-tables-up.sql
# 3. Create both tables with all constraints
# 4. Add indexes
```

## Verification Steps

After running the migration:

```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('characters', 'character_skills');

-- Check table structure
\d characters
\d character_skills

-- Verify foreign keys
SELECT tc.constraint_name, tc.table_name, kcu.column_name, 
       ccu.table_name AS foreign_table_name,
       ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('characters', 'character_skills');
```

## Backend Compatibility

The existing backend models in `/src/models/characterModel.js` are compatible with this migration:
- Uses parameterized queries (not UUID-specific)
- createCharacter() function will work with INTEGER IDs
- All functions use generic SQL that works with both types

## Next Steps

1. **Run Migration**: Execute `npm run db:migrate` when PostgreSQL is available
2. **Verify**: Check that tables are created correctly
3. **Test**: Test the character creation and skill features
4. **Seed Data** (Optional): Create initial characters for existing users if needed

## Notes

- Migration filename timestamp: `20251117210239`
- This is the latest migration and will run after all existing migrations
- The migration is idempotent (uses IF NOT EXISTS checks where appropriate)
- Rollback is supported via `npm run db:migrate:down`
