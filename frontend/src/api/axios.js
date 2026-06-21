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

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If the error is 401 Unauthorized and we haven't retried this request yet
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call the refresh endpoint to get a new access token
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
                    {},
                    { withCredentials: true } // Crucial to send the HttpOnly cookie
                );

                const { accessToken } = refreshResponse.data;

                // Update localStorage with the new access token
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.accessToken = accessToken;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                // Update the Authorization header for the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Retry the original request using our api instance
                return api(originalRequest);
            } catch (refreshError) {
                // If refreshing fails (e.g. refresh token expired/invalid), log out the user
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
