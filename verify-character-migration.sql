-- Verification Script for Character Tables Migration
-- Run this after executing: npm run db:migrate

-- 1. Check if tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('characters', 'character_skills')
ORDER BY table_name;

-- 2. Describe characters table structure
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'characters'
ORDER BY ordinal_position;

-- 3. Describe character_skills table structure
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'character_skills'
ORDER BY ordinal_position;

-- 4. Check foreign key constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('characters', 'character_skills')
ORDER BY tc.table_name, kcu.column_name;

-- 5. Check unique constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE' 
  AND tc.table_name IN ('characters', 'character_skills')
ORDER BY tc.table_name, kcu.column_name;

-- 6. Check check constraints (skill_name validation)
SELECT 
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    tbl.relname AS table_name,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class tbl ON con.conrelid = tbl.oid
WHERE tbl.relname IN ('characters', 'character_skills')
  AND con.contype = 'c'
ORDER BY tbl.relname;

-- 7. Check indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE tablename IN ('characters', 'character_skills')
ORDER BY tablename, indexname;

-- 8. Test inserting a character (requires existing user)
-- Uncomment and replace USER_UUID with actual user UUID to test
-- INSERT INTO characters (user_id, character_name, level)
-- VALUES ('USER_UUID', 'Test Character', 1)
-- RETURNING *;

-- 9. Test inserting skills (requires character_id from step 8)
-- Uncomment and replace CHARACTER_ID with actual character id
-- INSERT INTO character_skills (character_id, skill_name, skill_level) VALUES
-- (CHARACTER_ID, 'attack', 1),
-- (CHARACTER_ID, 'speed', 1),
-- (CHARACTER_ID, 'dexterity', 1),
-- (CHARACTER_ID, 'luck', 1),
-- (CHARACTER_ID, 'intelligence', 1)
-- RETURNING *;

-- 10. Count records (should be 0 initially)
SELECT 
    'characters' AS table_name,
    COUNT(*) AS record_count
FROM characters
UNION ALL
SELECT 
    'character_skills' AS table_name,
    COUNT(*) AS record_count
FROM character_skills;
