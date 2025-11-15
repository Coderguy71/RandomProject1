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
  submitAnswer: async (problemId, answer, timeSpent) => {
    const response = await apiClient.post(`/attempts/problems/${problemId}/submit`, {
      answer,
      timeSpent,
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

// Village API
export const villageAPI = {
  getVillageState: async () => {
    const response = await apiClient.get('/village');
    return response.data;
  },

  getDecorations: async () => {
    const response = await apiClient.get('/village/decorations');
    return response.data;
  },

  getOwnedDecorations: async () => {
    const response = await apiClient.get('/village/decorations/owned');
    return response.data;
  },

  purchaseDecoration: async (decorationId) => {
    const response = await apiClient.post(`/village/decorations/${decorationId}/purchase`);
    return response.data;
  },

  placeDecoration: async (decorationId, position) => {
    const response = await apiClient.post(`/village/decorations/${decorationId}/place`, {
      position,
    });
    return response.data;
  },

  removeDecoration: async (placementId) => {
    const response = await apiClient.delete(`/village/decorations/placements/${placementId}`);
    return response.data;
  },

  updateDecorationPosition: async (placementId, position) => {
    const response = await apiClient.put(`/village/decorations/placements/${placementId}`, {
      position,
    });
    return response.data;
  },

  getMilestones: async () => {
    const response = await apiClient.get('/village/milestones');
    return response.data;
  },

  getStreak: async () => {
    const response = await apiClient.get('/village/streak');
    return response.data;
  },

  getHistory: async () => {
    const response = await apiClient.get('/village/history');
    return response.data;
  },
};

// Learning Path API
export const learningPathAPI = {
  getRecommendations: async () => {
    const response = await apiClient.get('/learning-path/recommendations');
    return response.data;
  },

  getOverview: async () => {
    const response = await apiClient.get('/learning-path/overview');
    return response.data;
  },

  getNextRecommendation: async () => {
    const response = await apiClient.get('/learning-path/next');
    return response.data;
  },

  completeRecommendation: async (recommendationId) => {
    const response = await apiClient.post(`/learning-path/recommendations/${recommendationId}/complete`);
    return response.data;
  },

  getPerformance: async () => {
    const response = await apiClient.get('/learning-path/performance');
    return response.data;
  },

  refreshRecommendations: async () => {
    const response = await apiClient.post('/learning-path/refresh');
    return response.data;
  },
};