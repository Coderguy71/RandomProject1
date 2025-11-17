const { query, pool } = require('../utils/database');

const DEFAULT_SKILLS = ['attack', 'speed', 'dexterity', 'luck', 'intelligence'];

const createCharacter = async (userId, characterName = 'Scholar') => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create character
    const characterResult = await client.query(
      `INSERT INTO characters (user_id, character_name, level)
       VALUES ($1, $2, 1)
       RETURNING id, user_id, character_name, level, created_at, updated_at`,
      [userId, characterName]
    );

    const character = characterResult.rows[0];

    // Create default skills
    for (const skillName of DEFAULT_SKILLS) {
      await client.query(
        `INSERT INTO character_skills (character_id, skill_name, skill_level)
         VALUES ($1, $2, 1)`,
        [character.id, skillName]
      );
    }

    await client.query('COMMIT');

    return character;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getCharacterByUserId = async (userId) => {
  const result = await query(
    `SELECT id, user_id, character_name, level, created_at, updated_at
     FROM characters
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0];
};

const getCharacterSkills = async (characterId) => {
  const result = await query(
    `SELECT id, character_id, skill_name, skill_level, created_at, updated_at
     FROM character_skills
     WHERE character_id = $1
     ORDER BY skill_name`,
    [characterId]
  );

  return result.rows;
};

const getCharacterWithSkills = async (userId) => {
  const character = await getCharacterByUserId(userId);

  if (!character) {
    return null;
  }

  const skills = await getCharacterSkills(character.id);

  return {
    ...character,
    skills,
  };
};

module.exports = {
  createCharacter,
  getCharacterByUserId,
  getCharacterSkills,
  getCharacterWithSkills,
};
