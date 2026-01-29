import axios from 'axios';

// Create axios instance with base URL pointing to backend
const API = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
});

// Add request interceptor to attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH API CALLS ====================

// Register new user
export const registerUser = (userData) => {
  return API.post('/auth/signup', userData);
};

// Login user
export const loginUser = (credentials) => {
  return API.post('/auth/login', credentials);
};

// Get current user profile
export const getUserProfile = () => {
  return API.get('/auth/getProfile');
};

// Get all students (admin only)
export const getAllStudents = () => {
  return API.get('/auth/getAllStudents');
};

// ==================== COURSE API CALLS ====================

// Get all courses
export const getAllCourses = (page = 1, limit = 9) => {
  return API.get(`/course/getAllCourses?page=${page}&limit=${limit}`);
};
// Get single course by ID
export const getCourseById = (courseId) => {
  return API.get(`/course/getcourse/${courseId}`);
};

// Create new course (admin only)
export const createCourse = (courseData) => {
  return API.post('/course/create', courseData);
};

// Create new course with image (admin only)
export const createCourseWithImage = (formData) => {
  return API.post('/course/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Update course (admin only)
export const updateCourse = (courseId, courseData) => {
  return API.put(`/course/update/${courseId}`, courseData);
};

// Delete course (admin only)
export const deleteCourse = (courseId) => {
  return API.delete(`/course/delete/${courseId}`);
};

// Get my courses (purchased)
export const getMyCourses = () => {
  return API.get('/course/my-courses');
};

// ==================== ORDER API CALLS ====================

// Create new order (buy course)
export const buyCourse = (courseId) => {
  return API.post('/order/buy', { courseId });
};

// Get user's orders
export const getMyOrders = () => {
  return API.get('/order/getMyOrder');
};

// Get all orders (admin only)
export const getAllOrders = () => {
  return API.get('/order/getall');
};

export default API;
