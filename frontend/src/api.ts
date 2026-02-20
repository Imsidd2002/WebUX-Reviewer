import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/';

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkStatus = async () => {
    const response = await api.get('/status');
    return response.data;
};

export const submitReview = async (url: string) => {
    const response = await api.post('/review', { url });
    return response.data;
};

export const getReview = async (id: string) => {
    const response = await api.get(`/review/${id}`);
    return response.data;
};

export const getRecentReviews = async () => {
    const response = await api.get('/review'); // We reused GET /review logic in backend?
    // Wait, backend router.get('/') fetches last 5.
    // Backend router.post('/') creates new.
    // Yes.
    return response.data;
}
