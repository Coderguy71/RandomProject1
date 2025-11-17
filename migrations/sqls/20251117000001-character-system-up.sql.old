-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_name VARCHAR(255) NOT NULL DEFAULT 'Scholar',
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_characters_user_id UNIQUE (user_id)
);

-- Create character_skills table
CREATE TABLE IF NOT EXISTS character_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  skill_level INTEGER DEFAULT 1 CHECK (skill_level >= 1 AND skill_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_character_skills_character_skill UNIQUE (character_id, skill_name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_character_skills_character_id ON character_skills(character_id);

-- Create triggers for timestamp updates
CREATE TRIGGER update_characters_timestamp
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_character_skills_timestamp
  BEFORE UPDATE ON character_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
