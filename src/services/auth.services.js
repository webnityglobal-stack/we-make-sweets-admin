import api from "../api/axios.js";

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;

      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials.';
      throw new Error(message);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      const data = response.data;
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed.';
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken: () => localStorage.getItem('token'),

  isAuthenticated: () => {
    return Boolean(localStorage.getItem('token'));
  },

  forgotPassword: async (identifier) => {
    try {
      const response = await api.post("/auth/forgot-password", {
        identifier,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send verification OTP.";
      throw new Error(message);
    }
  },

  verifyResetOTP: async (identifier, otp) => {
    try {
      const response = await api.post("/auth/verify-reset-otp", {
        identifier,
        otp,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Invalid or expired OTP code.";
      throw new Error(message);
    }
  },

  resetPassword: async (identifier, password) => {
    try {
      const response = await api.post("/auth/reset-password", {
        identifier,
        password,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to reset password.";
      throw new Error(message);
    }
  },
};

export default authService;