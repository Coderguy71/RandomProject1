import apiClient from './api';

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (userData) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },

  logout: async (refreshToken) => {
    const response = await apiClient.post('/auth/logout', { refreshToken });
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Practice Problems API
export const problemsAPI = {
  getProblems: async (params = {}) => {
    const response = await apiClient.get('/problems', { params });
    return response.data;
  },

  getProblem: async (id) => {
    const response = await apiClient.get(`/problems/${id}`);
    return response.data;
  },
};

// Attempts API
export const attemptsAPI = {
  submitAnswer: async (problemId, answer, timeTaken) => {
    const response = await apiClient.post(`/attempts/problems/${problemId}/submit`, {
      answer,
      time_taken: timeTaken,
    });
    return response.data;
  },

  getHistory: async (params = {}) => {
    const response = await apiClient.get('/attempts/history', { params });
    return response.data;
  },

  getAnalytics: async () => {
    const response = await apiClient.get('/attempts/analytics');
    return response.data;
  },
};

// Community API (removed)
// Learning Path API (removed)
// Analytics API (removed)
// Village API (removed)

// Tutorials API
export const tutorialsAPI = {
  getTutorials: async (params = {}) => {
    const response = await apiClient.get('/tutorials', { params });
    return response.data;
  },

  getTutorial: async (id) => {
    const response = await apiClient.get(`/tutorials/${id}`);
    return response.data;
  },

  getTutorialsBySubtopic: async (subtopicId, params = {}) => {
    const response = await apiClient.get(`/tutorials/subtopic/${subtopicId}`, { params });
    return response.data;
  },

  markAsViewed: async (tutorialId) => {
    const response = await apiClient.post(`/tutorials/${tutorialId}/viewed`);
    return response.data;
  },

  getRelatedProblems: async (tutorialId) => {
    const response = await apiClient.get(`/tutorials/${tutorialId}/problems`);
    return response.data;
  },
};

// Topics and Subtopics API
export const topicsAPI = {
  getTopics: async () => {
    const response = await apiClient.get('/topics');
    return response.data;
  },

  getSubtopics: async (topicId) => {
    const response = await apiClient.get(`/topics/${topicId}/subtopics`);
    return response.data;
  },

  getAllSubtopics: async () => {
    const response = await apiClient.get('/subtopics');
    return response.data;
  },
};

// Character API
export const characterAPI = {
  getCharacter: async () => {
    const response = await apiClient.get('/character');
    return response.data;
  },

  createCharacter: async (characterName = 'Scholar') => {
    const response = await apiClient.post('/character', { characterName });
    return response.data;
  },
};