const { AppError } = require('../middleware/errorHandler');
const { sendSuccess } = require('../utils/response');
const topicModel = require('../models/topicModel');
const progressModel = require('../models/progressModel');

const getTopics = async (req, res, next) => {
  try {
    const topics = await topicModel.getAllTopics();
    sendSuccess(res, topics);
  } catch (error) {
    next(error);
  }
};

const getSubtopicsByTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subtopics = await topicModel.getSubtopicsByTopic(id);
    sendSuccess(res, subtopics);
  } catch (error) {
    next(error);
  }
};

const getAllSubtopics = async (req, res, next) => {
  try {
    const userId = req.user?.userId; // Optional user ID for progress data
    const subtopics = await topicModel.getAllSubtopics(userId);
    sendSuccess(res, subtopics);
  } catch (error) {
    next(error);
  }
};

const getSubtopicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subtopic = await topicModel.getSubtopicById(id);
    
    if (!subtopic) {
      throw new AppError('Subtopic not found', 404);
    }
    
    sendSuccess(res, subtopic);
  } catch (error) {
    next(error);
  }
};

const getSubtopicProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const progress = await progressModel.getProgressBySubtopic(userId, id);
    sendSuccess(res, progress);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopics,
  getSubtopicsByTopic,
  getAllSubtopics,
  getSubtopicById,
  getSubtopicProgress,
};