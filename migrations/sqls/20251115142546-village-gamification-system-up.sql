-- Village Gamification System Migration
-- Extends village_state and adds supporting tables for streaks, decorations, milestones, and history

-- ========================================
-- 1. EXTEND VILLAGE STATE TABLE
-- ========================================
-- Add new columns for happiness, level, and experience
ALTER TABLE village_state 
ADD COLUMN IF NOT EXISTS village_happiness INTEGER DEFAULT 100 CHECK (village_happiness >= 0 AND village_happiness <= 100),
ADD COLUMN IF NOT EXISTS village_level INTEGER DEFAULT 1 CHECK (village_level >= 1),
ADD COLUMN IF NOT EXISTS experience_points INTEGER DEFAULT 0 CHECK (experience_points >= 0),
ADD COLUMN IF NOT EXISTS total_resources_earned JSONB DEFAULT '{"gold": 0, "gems": 0, "wood": 0}'::jsonb,
ADD COLUMN IF NOT EXISTS total_resources_spent JSONB DEFAULT '{"gold": 0, "gems": 0, "wood": 0}'::jsonb;

-- ========================================
-- 2. DAILY STREAKS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS daily_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
  last_practice_date DATE,
  streak_frozen BOOLEAN DEFAULT false,
  freeze_count INTEGER DEFAULT 0 CHECK (freeze_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_streaks_user_id ON daily_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_streaks_last_practice_date ON daily_streaks(last_practice_date);

-- ========================================
-- 3. VILLAGE DECORATIONS CATALOG
-- ========================================
CREATE TABLE IF NOT EXISTS village_decorations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  decoration_type VARCHAR(100) NOT NULL,
  rarity VARCHAR(50) DEFAULT 'common',
  cost_resources JSONB NOT NULL DEFAULT '{"gold": 0, "gems": 0, "wood": 0}'::jsonb,
  unlock_requirement JSONB DEFAULT NULL,
  image_url VARCHAR(1000),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_village_decorations_type ON village_decorations(decoration_type);
CREATE INDEX IF NOT EXISTS idx_village_decorations_rarity ON village_decorations(rarity);
CREATE INDEX IF NOT EXISTS idx_village_decorations_is_active ON village_decorations(is_active);

-- ========================================
-- 4. USER DECORATIONS (INVENTORY)
-- ========================================
CREATE TABLE IF NOT EXISTS user_decorations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  decoration_id UUID NOT NULL REFERENCES village_decorations(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 0),
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, decoration_id)
);

CREATE INDEX IF NOT EXISTS idx_user_decorations_user_id ON user_decorations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_decorations_decoration_id ON user_decorations(decoration_id);

-- ========================================
-- 5. USER DECORATION PLACEMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS user_decoration_placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  decoration_id UUID NOT NULL REFERENCES village_decorations(id) ON DELETE CASCADE,
  position_x INTEGER,
  position_y INTEGER,
  placed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_decoration_placements_user_id ON user_decoration_placements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_decoration_placements_decoration_id ON user_decoration_placements(decoration_id);

-- ========================================
-- 6. MILESTONES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  milestone_type VARCHAR(100) NOT NULL,
  requirement_criteria JSONB NOT NULL,
  reward_resources JSONB DEFAULT '{"gold": 0, "gems": 0, "wood": 0}'::jsonb,
  reward_experience INTEGER DEFAULT 0,
  icon_url VARCHAR(1000),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_milestones_type ON milestones(milestone_type);
CREATE INDEX IF NOT EXISTS idx_milestones_is_active ON milestones(is_active);

-- ========================================
-- 7. USER MILESTONES (ACHIEVEMENTS)
-- ========================================
CREATE TABLE IF NOT EXISTS user_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  progress JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, milestone_id)
);

CREATE INDEX IF NOT EXISTS idx_user_milestones_user_id ON user_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_user_milestones_milestone_id ON user_milestones(milestone_id);
CREATE INDEX IF NOT EXISTS idx_user_milestones_achieved_at ON user_milestones(achieved_at);

-- ========================================
-- 8. VILLAGE HISTORY TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS village_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  event_description TEXT,
  changes JSONB NOT NULL,
  village_state_snapshot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_village_history_user_id ON village_history(user_id);
CREATE INDEX IF NOT EXISTS idx_village_history_event_type ON village_history(event_type);
CREATE INDEX IF NOT EXISTS idx_village_history_created_at ON village_history(created_at);

-- ========================================
-- 9. UPDATE TRIGGERS
-- ========================================
CREATE TRIGGER update_daily_streaks_timestamp
  BEFORE UPDATE ON daily_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_village_decorations_timestamp
  BEFORE UPDATE ON village_decorations
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_decoration_placements_timestamp
  BEFORE UPDATE ON user_decoration_placements
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_milestones_timestamp
  BEFORE UPDATE ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- ========================================
-- 10. SEED INITIAL DECORATIONS
-- ========================================
INSERT INTO village_decorations (name, description, decoration_type, rarity, cost_resources, unlock_requirement, is_active) VALUES
('Basic Tree', 'A simple tree to beautify your village', 'tree', 'common', '{"gold": 50, "gems": 0, "wood": 10}', NULL, true),
('Flower Bed', 'Colorful flowers that brighten the village', 'garden', 'common', '{"gold": 30, "gems": 0, "wood": 5}', NULL, true),
('Stone Path', 'A decorative stone pathway', 'path', 'common', '{"gold": 40, "gems": 0, "wood": 0}', NULL, true),
('Fountain', 'An elegant water fountain', 'decoration', 'uncommon', '{"gold": 200, "gems": 5, "wood": 20}', '{"problems_completed": 10}', true),
('Statue', 'A grand statue to commemorate achievements', 'decoration', 'rare', '{"gold": 500, "gems": 20, "wood": 50}', '{"problems_completed": 50, "accuracy_rate": 70}', true),
('Garden Bench', 'A comfortable place to rest', 'furniture', 'common', '{"gold": 75, "gems": 0, "wood": 15}', NULL, true),
('Lamp Post', 'Lights up your village at night', 'lighting', 'common', '{"gold": 60, "gems": 0, "wood": 8}', NULL, true),
('Flag Pole', 'Show your village pride with a flag', 'decoration', 'uncommon', '{"gold": 150, "gems": 3, "wood": 25}', '{"streak_days": 7}', true),
('Cherry Blossom Tree', 'A beautiful flowering tree', 'tree', 'rare', '{"gold": 300, "gems": 15, "wood": 30}', '{"problems_completed": 25, "accuracy_rate": 80}', true),
('Golden Gate', 'A magnificent golden entrance', 'structure', 'legendary', '{"gold": 1000, "gems": 50, "wood": 100}', '{"problems_completed": 100, "accuracy_rate": 85, "streak_days": 30}', true);

-- ========================================
-- 11. SEED INITIAL MILESTONES
-- ========================================
INSERT INTO milestones (name, description, milestone_type, requirement_criteria, reward_resources, reward_experience, is_active) VALUES
('First Steps', 'Complete your first practice problem', 'problems', '{"problems_completed": 1}', '{"gold": 100, "gems": 5, "wood": 10}', 50, true),
('Quick Learner', 'Complete 10 practice problems', 'problems', '{"problems_completed": 10}', '{"gold": 250, "gems": 10, "wood": 25}', 100, true),
('Problem Solver', 'Complete 50 practice problems', 'problems', '{"problems_completed": 50}', '{"gold": 500, "gems": 25, "wood": 50}', 250, true),
('Math Master', 'Complete 100 practice problems', 'problems', '{"problems_completed": 100}', '{"gold": 1000, "gems": 50, "wood": 100}', 500, true),
('Accurate Mind', 'Achieve 70% accuracy rate', 'accuracy', '{"accuracy_rate": 70}', '{"gold": 300, "gems": 15, "wood": 30}', 150, true),
('Sharp Shooter', 'Achieve 85% accuracy rate', 'accuracy', '{"accuracy_rate": 85}', '{"gold": 600, "gems": 30, "wood": 60}', 300, true),
('Perfectionist', 'Achieve 95% accuracy rate', 'accuracy', '{"accuracy_rate": 95}', '{"gold": 1200, "gems": 60, "wood": 120}', 600, true),
('Week Warrior', 'Maintain a 7-day practice streak', 'streak', '{"streak_days": 7}', '{"gold": 400, "gems": 20, "wood": 40}', 200, true),
('Monthly Master', 'Maintain a 30-day practice streak', 'streak', '{"streak_days": 30}', '{"gold": 1500, "gems": 75, "wood": 150}', 750, true),
('Dedicated Student', 'Maintain a 100-day practice streak', 'streak', '{"streak_days": 100}', '{"gold": 5000, "gems": 250, "wood": 500}', 2500, true),
('Topic Explorer', 'Complete problems in all subtopics', 'exploration', '{"subtopics_completed": 6}', '{"gold": 800, "gems": 40, "wood": 80}', 400, true),
('Speed Demon', 'Complete 10 problems in under 2 minutes each', 'speed', '{"fast_completions": 10}', '{"gold": 350, "gems": 18, "wood": 35}', 175, true);

-- ========================================
-- COMMENTS
-- ========================================
COMMENT ON TABLE daily_streaks IS 'Tracks consecutive days of practice for each user';
COMMENT ON TABLE village_decorations IS 'Catalog of all available decorations for villages';
COMMENT ON TABLE user_decorations IS 'User inventory of owned decorations';
COMMENT ON TABLE user_decoration_placements IS 'Decorations currently placed in user villages';
COMMENT ON TABLE milestones IS 'Achievement definitions with requirements and rewards';
COMMENT ON TABLE user_milestones IS 'Milestones earned by users';
COMMENT ON TABLE village_history IS 'Log of all village state changes and events';
