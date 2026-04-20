import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api` 
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ---- Chat ----
export const sendChatMessage = async (messages, useNotesContext = false) => {
  const { data } = await api.post('/chat', { messages, useNotesContext });
  return data.response;
};

// ---- Notes ----
export const generateNotes = async (topic) => {
  const { data } = await api.post('/notes/generate', { topic });
  return data;
};

export const getAllNotes = async () => {
  const { data } = await api.get('/notes');
  return data;
};

export const deleteNote = async (id) => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};

// ---- Quizzes ----
export const generateQuiz = async (topic, difficulty, noteId = null) => {
  const { data } = await api.post('/quizzes/generate', { topic, difficulty, noteId });
  return data;
};

export const submitQuizResult = async (quiz_id, score, total) => {
  const { data } = await api.post('/quizzes/submit', { quiz_id, score, total });
  return data;
};

// ---- Analytics ----
export const getAnalytics = async () => {
  const { data } = await api.get('/analytics');
  return data;
};

// ---- YouTube ----
export const explainYouTube = async (url, title) => {
  const { data } = await api.post('/youtube/explain', { url, title });
  return data;
};
