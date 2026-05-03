import axios from "axios";

const API = "http://localhost:5000/api";

export const login = (data) => axios.post(`${API}/auth/login`, data);
export const signup = (data) => axios.post(`${API}/auth/signup`, data);

export const getTasks = (token) =>
  axios.get(`${API}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createTask = (data, token) =>
  axios.post(`${API}/tasks`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getProjects = (token) =>
  axios.get(`${API}/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createProject = (data, token) =>
  axios.post(`${API}/projects`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });