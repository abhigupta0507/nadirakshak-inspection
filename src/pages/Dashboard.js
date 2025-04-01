import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        await refreshUserProfile();
        setError("");
      } catch (err) {
        setError("Failed to load user profile. Please try again later.");
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [refreshUserProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button
          onClick={() => refreshUserProfile()}
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Inspection Dashboard</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Welcome, {currentUser?.name || userProfile?.name || "Inspector"}
          </h3>
          <p className="text-gray-600 mb-2">
            You are logged in as an Inspection user. Here you can manage and
            view inspection tasks and reports.
          </p>
        </div>

        {userProfile && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium mb-3">Your Profile Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{userProfile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userProfile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="font-medium">{userProfile.mobileNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {userProfile.city}, {userProfile.state}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">
                  {userProfile.role || "Inspection"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2">Pending Inspections</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2">Reports</h3>
            <p className="text-3xl font-bold text-yellow-600">0</p>
          </div>
        </div>

        <div className="mt-8">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Start New Inspection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
