const { AppError } = require('../middleware/errorHandler');
const { sendSuccess, sendPaginated } = require('../utils/response');
const tutorialModel = require('../models/tutorialModel');

const getTutorials = async (req, res, next) => {
  try {
    const { search, topic_id, page = 1, page_size = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(page_size, 10);

    if (pageNum < 1 || pageSize < 1 || pageSize > 100) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const offset = (pageNum - 1) * pageSize;

    const tutorials = await tutorialModel.getAllTutorials({
      search,
      topicId: topic_id,
      limit: pageSize,
      offset,
    });

    const total = await tutorialModel.countAllTutorials({
      search,
      topicId: topic_id,
    });

    sendPaginated(res, tutorials, total, pageNum, pageSize);
  } catch (error) {
    next(error);
  }
};

const getTutorialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tutorial = await tutorialModel.getTutorialById(id);

    if (!tutorial) {
      throw new AppError('Tutorial not found', 404);
    }

    // Get view status if user is authenticated
    let viewStatus = null;
    if (req.user) {
      viewStatus = await tutorialModel.getTutorialViewStatus(req.user.id, id);
    }

    // Get related practice problems
    const relatedProblems = await tutorialModel.getRelatedProblems(id, { limit: 5 });

    // Remove correct answers from problems
    const problemsWithoutAnswers = relatedProblems.map(problem => {
      const { correct_answer, explanation, ...problemData } = problem;
      return problemData;
    });

    const tutorialData = {
      ...tutorial,
      view_status: viewStatus ? {
        viewed_at: viewStatus.viewed_at,
        completed: viewStatus.completed
      } : null,
      related_problems: problemsWithoutAnswers,
    };

    sendSuccess(res, tutorialData);
  } catch (error) {
    next(error);
  }
};

const getTutorialsBySubtopic = async (req, res, next) => {
  try {
    const { subtopic_id } = req.params;
    const { page = 1, page_size = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(page_size, 10);

    if (pageNum < 1 || pageSize < 1 || pageSize > 100) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const offset = (pageNum - 1) * pageSize;

    const tutorials = await tutorialModel.getTutorialsBySubtopic({
      subtopicId: subtopic_id,
      limit: pageSize,
      offset,
    });

    const total = await tutorialModel.countTutorialsBySubtopic(subtopic_id);

    sendPaginated(res, tutorials, total, pageNum, pageSize);
  } catch (error) {
    next(error);
  }
};

const markTutorialAsViewed = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if tutorial exists
    const tutorial = await tutorialModel.getTutorialById(id);
    if (!tutorial) {
      throw new AppError('Tutorial not found', 404);
    }

    // Mark as viewed
    const viewRecord = await tutorialModel.markTutorialAsViewed(userId, id);

    sendSuccess(res, {
      tutorial_id: id,
      user_id: userId,
      viewed_at: viewRecord.viewed_at,
      completed: viewRecord.completed,
    });
  } catch (error) {
    next(error);
  }
};

const getTutorialProblems = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    const limitNum = parseInt(limit, 10);
    if (limitNum < 1 || limitNum > 50) {
      throw new AppError('Limit must be between 1 and 50', 400);
    }

    // Check if tutorial exists
    const tutorial = await tutorialModel.getTutorialById(id);
    if (!tutorial) {
      throw new AppError('Tutorial not found', 404);
    }

    const relatedProblems = await tutorialModel.getRelatedProblems(id, { limit: limitNum });

    // Remove correct answers from problems
    const problemsWithoutAnswers = relatedProblems.map(problem => {
      const { correct_answer, explanation, ...problemData } = problem;
      return problemData;
    });

    sendSuccess(res, {
      tutorial_id: id,
      tutorial_title: tutorial.title,
      problems: problemsWithoutAnswers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTutorials,
  getTutorialById,
  getTutorialsBySubtopic,
  markTutorialAsViewed,
  getTutorialProblems,
};