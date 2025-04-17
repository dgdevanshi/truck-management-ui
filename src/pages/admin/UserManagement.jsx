"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getOperators,
  updateUser,
  reset as resetUsers,
} from "../../features/users/userSlice";
import { register, reset as resetAuth } from "../../features/auth/authSlice";
import { getCheckpoints } from "../../features/workflows/workflowSlice";
import ResponsiveTable from "../../components/ResponsiveTable";
import LoadingSpinner from "../../components/LoadingSpinner";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { operators, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.users
  );
  const {
    isLoading: isAuthLoading,
    isError: isAuthError,
    isSuccess: isAuthSuccess,
    message: authMessage,
  } = useSelector((state) => state.auth);
  const { checkpoints } = useSelector((state) => state.workflows);

  const [editingUser, setEditingUser] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "operator",
    assignedCheckpointId: null,
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "operator",
    assignedCheckpointId: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getOperators());
    dispatch(getCheckpoints());

    return () => {
      dispatch(resetUsers());
      dispatch(resetAuth());
    };
  }, [dispatch]);

  // Show success/error messages and refresh the operator list when a new user is registered successfully
  useEffect(() => {
    if (isError) {
      toast.error(message || "An error occurred");
      dispatch(resetUsers());
    }

    if (isAuthSuccess) {
      // toast.success("User registered successfully!");
      dispatch(getOperators());
      setShowRegisterForm(false);
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "operator",
        assignedCheckpointId: null,
      });

      // Reset the form after successful registration
      setTimeout(() => {
        dispatch(resetAuth());
      }, 500);
    }

    if (isAuthError) {
      toast.error(authMessage || "Registration failed");
      dispatch(resetAuth());
    }
  }, [
    isSuccess,
    isError,
    message,
    isAuthSuccess,
    isAuthError,
    authMessage,
    dispatch,
  ]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      assignedCheckpointId: user.assignedCheckpointId,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser({ userId: editingUser.id, userData: formData }));
    setEditingUser(null);
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!registerData.name) {
      newErrors.name = "Name is required";
    }

    // if (!registerData.email) {
    //   newErrors.email = "Email is required";
    // } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
    //   newErrors.email = "Email is invalid";
    // }

    if (!registerData.email) {
      newErrors.role = "Email or Phone is required";
    }

    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    // Prepare data for API - remove confirmPassword as it's not needed by the API
    const userData = {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      role: registerData.role,
      assignedCheckpointId:
        registerData.role === "operator" && registerData.assignedCheckpointId
          ? Number.parseInt(registerData.assignedCheckpointId)
          : null,
    };

    dispatch(register(userData));
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  // Get checkpoint name by ID
  const getCheckpointName = (checkpointId) => {
    if (!checkpointId) return "None";
    const checkpoint = checkpoints.find(
      (cp) => cp.id === Number.parseInt(checkpointId)
    );
    return checkpoint ? checkpoint.name : checkpointId;
  };

  // Table headers for responsive table
  const tableHeaders = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "assignedCheckpointId",
      label: "Assigned Checkpoint",
      render: (user) => getCheckpointName(user.assignedCheckpointId),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <button
          onClick={() => handleEdit(user)}
          className="rounded-md bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800 hover:bg-teal-200"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">User Management</h1>

      {/* User List */}
      <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Operators</h2>
          <button
            onClick={() => setShowRegisterForm(true)}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 w-full sm:w-auto"
          >
            Add New User
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveTable
            headers={tableHeaders}
            data={operators}
            renderRow={(user, index, viewType) => {
              if (viewType === "table") {
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCheckpointName(user.assignedCheckpointId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(user)}
                        className="rounded-md bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800 hover:bg-teal-200"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              }
            }}
            emptyMessage="No operators found"
          />
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Edit User
            </h2>
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
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
                <div className="mb-4">
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
                    <option value="">None</option>
                    {checkpoints.map((checkpoint) => (
                      <option key={checkpoint.id} value={checkpoint.id}>
                        {checkpoint.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto mb-2 sm:mb-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 w-full sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register New User Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Register New User
            </h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="register-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="register-name"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
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
                  htmlFor="register-email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email or Phone
                </label>
                <input
                  type="text"
                  id="register-email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className={`w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`}
                  placeholder="Enter user's email or phone"
                />
                {/* {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )} */}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="register-password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
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
                  htmlFor="register-confirmPassword"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="register-confirmPassword"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className={`w-full rounded-md border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
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
                  htmlFor="register-role"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="register-role"
                  name="role"
                  value={registerData.role}
                  onChange={handleRegisterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {registerData.role === "operator" && (
                <div className="mb-4">
                  <label
                    htmlFor="register-assignedCheckpointId"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Assigned Checkpoint
                  </label>
                  <select
                    id="register-assignedCheckpointId"
                    name="assignedCheckpointId"
                    value={registerData.assignedCheckpointId || ""}
                    onChange={handleRegisterChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">Select a checkpoint</option>
                    {checkpoints.map((checkpoint) => (
                      <option key={checkpoint.id} value={checkpoint.id}>
                        {checkpoint.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto mb-2 sm:mb-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 w-full sm:w-auto disabled:bg-teal-300"
                >
                  {isAuthLoading ? "Registering..." : "Register User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
