import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return alert("Please enter your email.");
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        // "http://localhost:5000/api/v1/auth/forgot-password",
        'https://api.webnityglobal.in/api/v1/auth/forgot-password',
        {
          email,
        }
      );

      setMessage(res.data.message);
      setEmail("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-center mt-2 mb-6">
          Enter your registered email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter email"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {message && (
          <div className="mt-5 text-center text-sm text-green-600">
            {message}
          </div>
        )}

        <div className="mt-6 text-center">

          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            ← Back to Login
          </Link>

        </div>

      </div>
    </div>
  );
}