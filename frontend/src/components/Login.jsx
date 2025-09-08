import React, { useState } from "react";
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { Navigate, Link } from "react-router-dom";

function Login() {
  const { userLoggedIn } = useAuth();
  const { role } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (err) {
        setError("Invalid credentials, please try again.");
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-4">
      {userLoggedIn && role === "student" && <Navigate to="/StudentDashboard" />}
      {userLoggedIn && role === "admin" && <Navigate to="/AdminDashboard" />}

      <div className="w-full max-w-md bg-white rounded-xl border-2 border-gray-200 shadow-lg shadow-gray-400/50 p-8">
        {/* Title */} 
        <h1 className="text-2xl font-semibold text-center text-black mb-6">
          Login to your account
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full cursor-pointer bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            {isSigningIn ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <Link
            to="/SignUp"
            className="text-sm text-black hover:text-blue-800 hover:underline transition-colors"
          >
            Don't have an account? Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;