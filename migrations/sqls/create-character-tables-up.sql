-- Create characters table
CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  character_name VARCHAR(255) DEFAULT 'My Character',
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create character_skills table
CREATE TABLE character_skills (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL CHECK (skill_name IN ('attack', 'speed', 'dexterity', 'luck', 'intelligence')),
  skill_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_character_skill UNIQUE (character_id, skill_name)
);

-- Create indexes for better query performance
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_character_skills_character_id ON character_skills(character_id);
