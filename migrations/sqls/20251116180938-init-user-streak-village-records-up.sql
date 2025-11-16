-- Initialize streak and village records for all existing users

-- Create daily_streak records for users who don't have them
INSERT INTO daily_streaks (user_id, current_streak, longest_streak)
SELECT u.id, 0, 0
FROM users u
LEFT JOIN daily_streaks ds ON u.id = ds.user_id
WHERE ds.id IS NULL AND u.is_active = true
ON CONFLICT (user_id) DO NOTHING;

-- Create village_state records for users who don't have them
INSERT INTO village_state (
  user_id,
  village_health,
  village_happiness,
  village_level,
  experience_points,
  resources,
  decorations,
  total_resources_earned,
  total_resources_spent
)
SELECT 
  u.id,
  100,
  100,
  1,
  0,
  '{"gold": 100, "gems": 10, "wood": 20}'::jsonb,
  '[]'::jsonb,
  '{"gold": 0, "gems": 0, "wood": 0}'::jsonb,
  '{"gold": 0, "gems": 0, "wood": 0}'::jsonb
FROM users u
LEFT JOIN village_state vs ON u.id = vs.user_id
WHERE vs.id IS NULL AND u.is_active = true
ON CONFLICT (user_id) DO NOTHING;
