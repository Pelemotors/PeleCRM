import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getLoanRequests = (filters = {}) =>
  API.get('/loan_requests', { params: filters });

export const updateLoanRequest = (id, data) =>
  API.put(`/loan_requests/${id}`, data);
