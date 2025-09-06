import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/users/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Login Response:", response.data);

      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("firstName", response.data.firstname);
        window.dispatchEvent(new Event("storage"));
        window.location.href = "/profile";
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#008080] to-[#006666] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#008080] mb-2">Welcome Back</h2>
          <p className="text-gray-600">Please sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#008080] focus:border-[#008080] transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#008080] text-white font-semibold rounded-lg shadow-md hover:bg-[#006666] focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-opacity-50 transition-colors duration-200">
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-[#008080] hover:text-[#006666] font-medium hover:underline transition-colors duration-200">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
