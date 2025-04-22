import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your actual backend URL
  headers: {
    'Content-Type': 'application/json',
  }
});

// 🔐 Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ❌ Removed token refresh functionality
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // ❌ Token expired or invalid
      localStorage.removeItem("token");

  
      if(window.location.href.includes('login')===false){
      window.location.href = '/login'; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default api;
