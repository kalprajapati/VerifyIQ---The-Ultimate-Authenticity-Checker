import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analyze';

const api = axios.create({
    baseURL: API_URL
});

export const analyzeMedia = async (formData) => {
    const response = await api.post('/', formData);
    return response.data;
};

export const analyzeText = async (text) => {
    const response = await api.post('/text', { text });
    return response.data;
};

export const getReport = async (id) => {
    const response = await api.get(`/report/${id}`);
    return response.data;
};