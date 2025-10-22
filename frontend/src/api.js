// src/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";


const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});



export const fetchJobs = (params = {}) => client.get("/getAllJobs", { params });
export const createJob = (payload) => client.post("/createJob", payload);
export const updateJob = (id, payload) => client.put(`/updateJob/${id}`, payload);
export const deleteJob = (id) => client.delete(`/removeJob/${id}`);
export const getJob = (id) => client.get(`/getJobById/${id}`);
