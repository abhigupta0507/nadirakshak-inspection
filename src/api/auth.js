import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/auth";

// Create axios instance with auth header
const authAxios = axios.create({
  baseURL: API_URL,
});

// Add interceptor to add token to requests
authAxios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.accessToken) {
      config.headers["Authorization"] = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register new user with inspection role
export const registerUser = async (userData) => {
  const modifiedData = { ...userData, role: "Inspection" };
  return await axios.post(`${API_URL}/register`, modifiedData);
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  return await axios.post(`${API_URL}/verify-otp`, { email, otp });
};

// Login
export const loginUser = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};

// Initiate password reset
export const initiatePasswordReset = async (email) => {
  return await axios.post(`${API_URL}/forgot-password`, { email });
};

// Verify reset password OTP
export const verifyResetOTP = async (email, otp) => {
  return await axios.post(`${API_URL}/verify-reset-otp`, { email, otp });
};

// Reset password
export const resetPassword = async (verificationToken, newPassword) => {
  return await axios.post(`${API_URL}/reset-password`, {
    verificationToken,
    newPassword,
  });
};

// Get user profile
export const getUserProfile = async () => {
  return await authAxios.get(`${API_URL}/profile`);
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  return await authAxios.patch(`${API_URL}/profile`, profileData);
};
