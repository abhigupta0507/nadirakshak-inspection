import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get email from location state
  const email = location.state?.email;

  useEffect(() => {
    // If no email is provided, redirect to register page
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email information is missing. Please try registering again.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await verifyOTP(email, otp);
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>

        {email && (
          <div className="mb-4 text-center text-gray-600">
            <p>
              An OTP has been sent to: <strong>{email}</strong>
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="otp"
            >
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              pattern="[0-9]{6}"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center text-2xl letter-spacing-wide"
              placeholder="------"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Didn't receive the OTP?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-500 hover:text-blue-800"
            >
              Try Again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
