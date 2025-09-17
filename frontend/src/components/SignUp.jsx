import React, { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { useNavigate, Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import StudentProfileSetup from "./FaceRegister";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredintials = await doCreateUserWithEmailAndPassword(email, password);
      const user = userCredintials.user;

      await updateProfile(user, { displayName: role }); // saves user type in firebase
      setIsSignedUp(true);
      // You can pass userType to your database or user profile here
      console.log("User type:", role); // For now, just logging

      if(role === "student") {
        navigate("/Register_Face");
      } else {
        navigate("/AdminDashboard");
      }
    } catch (err) {
      if(err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else {
        setError("Sign up failed. Try again.");
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {isSignedUp ? null : (
        <div className="w-full max-w-md bg-white rounded-xl border-2 border-gray-200 shadow-lg shadow-gray-400/50 p-8">


          {/* Title */}
          <h1 className="text-2xl font-semibold text-center text-black mb-4">
            Create a new account
          </h1>

          {/* User Type Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              Select Account Type
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all cursor-pointer ${
                  role === "student"
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all cursor-pointer ${
                  role === "admin"
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

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
              className="cursor-pointer w-full bg-black hover:bg-black text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Sign Up as {role === "student" ? "Student" : "Admin"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/Login"
              className="text-sm text-black hover:text-blue-800 hover:underline transition-colors"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;