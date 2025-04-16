"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login, reset } from "../../features/auth/authSlice";
import { testApiConnection, checkApiEndpoints } from "../../utils/apiTest";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiStatus, setApiStatus] = useState(null);

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Test API connection on component mount
    const checkApi = async () => {
      const result = await testApiConnection();
      setApiStatus(result);

      if (!result.success) {
        // If basic connection fails, check specific endpoints
        await checkApiEndpoints();
      }
    };

    checkApi();

    // Reset auth state on component unmount
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Show error/success messages
  useEffect(() => {
    if (isError) {
      toast.error(message || "Login failed");
    }

    if (isSuccess) {
      toast.success("Login successful!");
    }
  }, [isError, isSuccess, message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted");

    if (!validate()) {
      console.log("Form validation failed", errors);
      return;
    }

    console.log("Dispatching login action");
    dispatch(login(formData));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">
        Login
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-teal-600 px-4 py-3 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-teal-300"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Debug info */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          API URL: {import.meta.env.VITE_API_URL || "http://localhost:8000"}
        </p>
        {apiStatus && (
          <p>
            API Status:{" "}
            {apiStatus.success ? (
              <span className="text-green-600">Connected</span>
            ) : (
              <span className="text-red-600">Connection Failed</span>
            )}
          </p>
        )}
        <p className="mt-2 text-gray-400">
          Check browser console for detailed API logs
        </p>
      </div>
    </div>
  );
};

export default Login;
