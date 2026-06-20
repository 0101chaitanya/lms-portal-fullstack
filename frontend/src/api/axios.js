import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true, // Crucial for sending/receiving the HttpOnly refresh token cookie
});

// Add a request interceptor to attach the access token
api.interceptors.request.use(
    (config) => {
        // We will store our auth state in localStorage for persistence
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Note: If you implement a refresh token endpoint later, you would add a response interceptor
// here to catch 401 errors, call the refresh endpoint, and retry the original request.

export default api;
