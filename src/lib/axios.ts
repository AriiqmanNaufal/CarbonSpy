import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001', // Backend URL
  withCredentials: true, // Important for sending httpOnly cookies
});

// We will add interceptors for token refresh and global error handling later
// For now, this sets up the basic reusable instance.

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Basic global error handling
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
