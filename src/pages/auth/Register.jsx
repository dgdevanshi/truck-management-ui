"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../../features/auth/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "operator",
    assignedCheckpointId: null,
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Reset auth state on component unmount
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Prepare data for API - remove confirmPassword as it's not needed by the API
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      assignedCheckpointId:
        formData.role === "operator" && formData.assignedCheckpointId
          ? Number.parseInt(formData.assignedCheckpointId)
          : null,
    };

    dispatch(register(userData));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">
        Register New User
      </h2>

      {isError && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {message}
        </div>
      )}

      {isSuccess && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
          User registered successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
            placeholder="Enter user's name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

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
            placeholder="Enter user's email"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
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
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="operator">Operator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {formData.role === "operator" && (
          <div className="mb-6">
            <label
              htmlFor="assignedCheckpointId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Assigned Checkpoint
            </label>
            <select
              id="assignedCheckpointId"
              name="assignedCheckpointId"
              value={formData.assignedCheckpointId || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">Select a checkpoint</option>
              <option value="1">Dock 1</option>
              <option value="2">Inspection Bay</option>
              <option value="3">Loading Area</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-teal-600 px-4 py-3 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-teal-300"
        >
          {isLoading ? "Registering..." : "Register User"}
        </button>
      </form>
    </div>
  );
};

export default Register;
