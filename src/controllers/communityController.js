const { sendSuccess, sendPaginated } = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');
const communityModel = require('../models/communityModel');

const VALID_TOPICS = ['general', 'algebra', 'geometry', 'trigonometry', 'statistics', 'calculus'];
const VALID_SORT_OPTIONS = ['newest', 'most-replied', 'trending'];

const normalizeTopic = (topic) => {
  if (!topic) {
    return 'general';
  }

  const normalized = topic.toString().trim().toLowerCase();
  return normalized.length > 0 ? normalized : 'general';
};

const validateTopic = (topic) => {
  const normalized = normalizeTopic(topic);
  if (!VALID_TOPICS.includes(normalized)) {
    throw new AppError(`Topic must be one of: ${VALID_TOPICS.join(', ')}`, 400);
  }
  return normalized;
};

const toPostResponse = (post, { replyCountOverride = null } = {}) => {
  if (!post) {
    return null;
  }

  const replyCount = replyCountOverride !== null && replyCountOverride !== undefined
    ? replyCountOverride
    : parseInt(post.reply_count || 0, 10);

  return {
    id: post.id,
    userId: post.user_id,
    title: post.title,
    content: post.content,
    topic: post.topic,
    author: {
      username: post.username,
      firstName: post.first_name,
      lastName: post.last_name,
    },
    replyCount,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
};

const toReplyResponse = (reply) => {
  if (!reply) {
    return null;
  }

  return {
    id: reply.id,
    postId: reply.post_id,
    userId: reply.user_id,
    content: reply.content,
    parentId: reply.parent_id,
    author: {
      username: reply.username,
      firstName: reply.first_name,
      lastName: reply.last_name,
    },
    createdAt: reply.created_at,
    updatedAt: reply.updated_at,
  };
};

const buildRepliesTree = (flatReplies) => {
  if (!flatReplies.length) {
    return [];
  }

  const replyMap = new Map();
  const roots = [];

  flatReplies.forEach((reply) => {
    const withChildren = { ...reply, replies: [] };
    replyMap.set(reply.id, withChildren);
  });

  flatReplies.forEach((reply) => {
    const current = replyMap.get(reply.id);
    if (current.parentId && replyMap.has(current.parentId)) {
      replyMap.get(current.parentId).replies.push(current);
    } else {
      roots.push(current);
    }
  });

  return roots;
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, topic } = req.body;
    const userId = req.user.sub;

    if (!title || title.trim().length === 0) {
      throw new AppError('Title is required', 400);
    }

    if (title.trim().length > 500) {
      throw new AppError('Title must be 500 characters or less', 400);
    }

    if (!content || content.trim().length === 0) {
      throw new AppError('Content is required', 400);
    }

    const normalizedTopic = validateTopic(topic);

    const post = await communityModel.createPost({
      userId,
      title: title.trim(),
      content: content.trim(),
      topic: normalizedTopic,
    });

    const postWithAuthor = await communityModel.getPostById(post.id);
    const formattedPost = toPostResponse(postWithAuthor);

    sendSuccess(res, formattedPost, 201, 'Post created successfully');
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const {
      topic,
      search,
      sort = 'newest',
      page = '1',
      limit: limitParam,
      pageSize: pageSizeParam,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitRaw = limitParam || pageSizeParam || '20';
    const pageSize = parseInt(limitRaw, 10);

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      throw new AppError('Page size must be between 1 and 100', 400);
    }

    if (!VALID_SORT_OPTIONS.includes(sort)) {
      throw new AppError(`Sort must be one of: ${VALID_SORT_OPTIONS.join(', ')}`, 400);
    }

    const topicFilter = topic ? validateTopic(topic) : null;
    const searchFilter = search && search.trim().length > 0 ? search.trim() : null;

    const offset = (pageNum - 1) * pageSize;

    const [posts, total] = await Promise.all([
      communityModel.getPosts({
        topic: topicFilter,
        search: searchFilter,
        sort,
        limit: pageSize,
        offset,
      }),
      communityModel.countPosts({ topic: topicFilter, search: searchFilter }),
    ]);

    const formattedPosts = posts.map((post) => toPostResponse(post));

    sendPaginated(res, formattedPosts, total, pageNum, pageSize);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await communityModel.getPostById(id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const replies = await communityModel.getRepliesByPostId(id);
    const formattedReplies = replies.map((reply) => toReplyResponse(reply));
    const nestedReplies = buildRepliesTree(formattedReplies);

    const formattedPost = toPostResponse(post, { replyCountOverride: formattedReplies.length });

    sendSuccess(
      res,
      {
        ...formattedPost,
        replies: nestedReplies,
      },
      200,
      'Post retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, topic } = req.body;
    const userId = req.user.sub;

    const existingPost = await communityModel.getPostById(id);

    if (!existingPost) {
      throw new AppError('Post not found', 404);
    }

    if (existingPost.user_id !== userId) {
      throw new AppError('You can only edit your own posts', 403);
    }

    if (!title || title.trim().length === 0) {
      throw new AppError('Title is required', 400);
    }

    if (title.trim().length > 500) {
      throw new AppError('Title must be 500 characters or less', 400);
    }

    if (!content || content.trim().length === 0) {
      throw new AppError('Content is required', 400);
    }

    const normalizedTopic = topic ? validateTopic(topic) : existingPost.topic;

    const updatedPost = await communityModel.updatePost({
      postId: id,
      title: title.trim(),
      content: content.trim(),
      topic: normalizedTopic,
    });

    const postWithAuthor = await communityModel.getPostById(updatedPost.id);
    const formattedPost = toPostResponse(postWithAuthor);

    sendSuccess(res, formattedPost, 200, 'Post updated successfully');
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;

    const existingPost = await communityModel.getPostById(id);

    if (!existingPost) {
      throw new AppError('Post not found', 404);
    }

    if (existingPost.user_id !== userId) {
      throw new AppError('You can only delete your own posts', 403);
    }

    await communityModel.deletePost(id);

    sendSuccess(res, { id }, 200, 'Post deleted successfully');
  } catch (error) {
    next(error);
  }
};

const createReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.sub;

    const post = await communityModel.getPostById(id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (!content || content.trim().length === 0) {
      throw new AppError('Content is required', 400);
    }

    let parentReplyId = null;

    if (parentId) {
      const parentReply = await communityModel.getReplyById(parentId);
      if (!parentReply) {
        throw new AppError('Parent reply not found', 404);
      }
      if (parentReply.post_id !== id) {
        throw new AppError('Parent reply does not belong to this post', 400);
      }
      parentReplyId = parentReply.id;
    }

    const reply = await communityModel.createReply({
      postId: id,
      userId,
      content: content.trim(),
      parentId: parentReplyId,
    });

    const replyWithAuthor = await communityModel.getReplyById(reply.id);
    const formattedReply = toReplyResponse(replyWithAuthor);

    sendSuccess(res, formattedReply, 201, 'Reply created successfully');
  } catch (error) {
    next(error);
  }
};

const updateReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.sub;

    const existingReply = await communityModel.getReplyById(id);

    if (!existingReply) {
      throw new AppError('Reply not found', 404);
    }

    if (existingReply.user_id !== userId) {
      throw new AppError('You can only edit your own replies', 403);
    }

    if (!content || content.trim().length === 0) {
      throw new AppError('Content is required', 400);
    }

    const updatedReply = await communityModel.updateReply({
      replyId: id,
      content: content.trim(),
    });

    const replyWithAuthor = await communityModel.getReplyById(updatedReply.id);
    const formattedReply = toReplyResponse(replyWithAuthor);

    sendSuccess(res, formattedReply, 200, 'Reply updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;

    const existingReply = await communityModel.getReplyById(id);

    if (!existingReply) {
      throw new AppError('Reply not found', 404);
    }

    if (existingReply.user_id !== userId) {
      throw new AppError('You can only delete your own replies', 403);
    }

    await communityModel.deleteReply(id);

    sendSuccess(res, { id }, 200, 'Reply deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getTrendingPosts = async (req, res, next) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = parseInt(limit, 10);

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      throw new AppError('Limit must be between 1 and 50', 400);
    }

    const posts = await communityModel.getTrendingPosts(limitNum);
    const formattedPosts = posts.map((post) => toPostResponse(post));

    sendSuccess(res, formattedPosts, 200, 'Trending posts retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  createReply,
  updateReply,
  deleteReply,
  getTrendingPosts,
};
