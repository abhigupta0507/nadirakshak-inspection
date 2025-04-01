import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initiatePasswordReset } from "../api/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await initiatePasswordReset(email);
      setSuccess(true);
      setTimeout(() => {
        navigate("/verify-reset-otp", { state: { email } });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to initiate password reset. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            OTP sent successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your registered email"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading || success}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:text-blue-800"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
