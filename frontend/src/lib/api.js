import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

export const taskAPI = {
  getAll: (params = {}) => api.get("/api/tasks", { params }),
  getOne: (id) => api.get(`/api/tasks/${id}`),
  create: (data) => api.post("/api/tasks", data),
  update: (id, data) => api.put(`/api/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/api/tasks/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/tasks/${id}`),
};

export default api;
