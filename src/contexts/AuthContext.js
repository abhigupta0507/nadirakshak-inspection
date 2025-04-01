import React, { createContext, useState, useContext, useEffect } from "react";
import { getUserProfile } from "../api/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUserAndProfile = async () => {
      setLoading(true);
      const user = localStorage.getItem("user");

      if (user) {
        const userData = JSON.parse(user);
        setCurrentUser(userData);

        // Also fetch the user profile if user exists
        try {
          const response = await getUserProfile();
          setUserProfile(response.data);
        } catch (error) {
          console.error("Error loading user profile:", error);
          // If unable to get profile with stored token, user might need to re-authenticate
          if (error.response?.status === 401) {
            localStorage.removeItem("user");
            setCurrentUser(null);
          }
        }
      }

      setLoading(false);
    };

    loadUserAndProfile();
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateProfile = (profileData) => {
    setUserProfile(profileData);
  };

  // Function to refresh user profile data
  const refreshUserProfile = async () => {
    if (!currentUser) return null;

    try {
      const response = await getUserProfile();
      setUserProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      return null;
    }
  };

  const value = {
    currentUser,
    userProfile,
    login,
    logout,
    loading,
    updateProfile,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
