const { sendSuccess } = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');
const characterModel = require('../models/characterModel');

const getCharacter = async (req, res, next) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      throw new AppError('Unable to identify user', 401);
    }

    const character = await characterModel.getCharacterWithSkills(userId);

    if (!character) {
      throw new AppError('Character not found. Please create a character first.', 404);
    }

    sendSuccess(
      res,
      {
        character,
      },
      200,
      'Character retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

const createCharacter = async (req, res, next) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      throw new AppError('Unable to identify user', 401);
    }

    const { characterName = 'Scholar' } = req.body;

    // Check if character already exists
    const existingCharacter = await characterModel.getCharacterByUserId(userId);

    if (existingCharacter) {
      throw new AppError('Character already exists for this user', 409);
    }

    const character = await characterModel.createCharacter(userId, characterName);

    // Fetch character with skills
    const characterWithSkills = await characterModel.getCharacterWithSkills(userId);

    sendSuccess(
      res,
      {
        character: characterWithSkills,
      },
      201,
      'Character created successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCharacter,
  createCharacter,
};
