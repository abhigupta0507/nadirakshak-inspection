// auth.js with improved token handling
import axios from "axios";

const API_URL = "https://nadirakshak-backend.onrender.com/api/v1/auth";

// Create axios instance with auth header
const authAxios = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token in every request
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

// Add token refresh interceptor
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = JSON.parse(
          localStorage.getItem("user")
        )?.refreshToken;
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post(`${API_URL}/refresh-token`, {
          refreshToken,
        });

        // Update stored user info with new tokens
        const user = JSON.parse(localStorage.getItem("user"));
        user.accessToken = response.data.accessToken;
        user.refreshToken = response.data.refreshToken;
        localStorage.setItem("user", JSON.stringify(user));

        // Update auth header and retry original request
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        return authAxios(originalRequest);
      } catch (refreshError) {
        // If refresh failed, log out user
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

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
  return await authAxios.get(`/profile`);
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  return await authAxios.patch(`/profile`, profileData);
};

// Add function to check user role
export const checkUserRole = (requiredRole) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return false;

  return user.role === requiredRole;
};
