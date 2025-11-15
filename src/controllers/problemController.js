const { AppError } = require('../middleware/errorHandler');
const { sendSuccess, sendPaginated } = require('../utils/response');
const problemModel = require('../models/problemModel');

const getProblems = async (req, res, next) => {
  try {
    const { subtopic_id, difficulty, page = 1, page_size = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(page_size, 10);

    if (pageNum < 1 || pageSize < 1 || pageSize > 100) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const offset = (pageNum - 1) * pageSize;

    let problems, total;

    if (subtopic_id) {
      problems = await problemModel.getProblemsBySubtopic({
        subtopicId: subtopic_id,
        difficulty,
        limit: pageSize,
        offset,
      });
      total = await problemModel.countProblemsBySubtopic({
        subtopicId: subtopic_id,
        difficulty,
      });
    } else {
      problems = await problemModel.getAllProblems({
        difficulty,
        limit: pageSize,
        offset,
      });
      total = await problemModel.countAllProblems({ difficulty });
    }

    const problemsWithoutAnswers = problems.map(problem => {
      const { correct_answer, explanation, ...problemData } = problem;
      return problemData;
    });

    sendPaginated(res, problemsWithoutAnswers, total, pageNum, pageSize);
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const problem = await problemModel.getProblemById(id);

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    const { correct_answer, explanation, ...problemData } = problem;

    sendSuccess(res, problemData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  getProblemById,
};
