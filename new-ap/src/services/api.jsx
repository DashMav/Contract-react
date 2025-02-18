// services/api.js

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Sources
  uploadSource: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/sources`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  getSources: async () => {
    const response = await fetch(`${API_BASE_URL}/sources`);
    return response.json();
  },

  // Chat
  sendMessage: async (message, sourceIds) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        source_ids: sourceIds,
      }),
    });
    return response.json();
  },

  // Notes
  createNote: async (content) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  getNotes: async () => {
    const response = await fetch(`${API_BASE_URL}/notes`);
    return response.json();
  },
};

export default api;