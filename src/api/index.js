
import axios from 'axios';

const API = axios.create({
    baseURL: 'https://tutors-finders-server.onrender.com/api' // URL вашого backend
});

// Перехоплювач (interceptor) для додавання токена до кожного запиту
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;