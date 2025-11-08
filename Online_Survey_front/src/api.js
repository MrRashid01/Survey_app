// api.js (already mostly present)
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api",
});

export const createSurvey  = (payload) => api.post("/surveys", payload);
export const listSurveys   = () => api.get("/surveys");
export const getSurvey     = (id) => api.get(`/surveys/${id}`);
export const submitAnswers = (id, answers) => api.post(`/surveys/${id}/responses`, { answers });
export const getAnalysis   = (id) => api.get(`/surveys/${id}/analysis`);
export const getSurveysByUser = (userId) => api.get(`/surveys/user/${userId}`);
