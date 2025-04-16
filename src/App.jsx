"use client";

import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkAuthStatus } from "./features/auth/authSlice";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import OperatorLayout from "./layouts/OperatorLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import WorkflowManagement from "./pages/admin/WorkflowManagement";
import TruckMonitoring from "./pages/admin/TruckMonitoring";
import Reports from "./pages/admin/Reports";

// Operator Pages
import OperatorDashboard from "./pages/operator/Dashboard";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // For debugging - log the user object whenever it changes
  useEffect(() => {
    if (user) {
      console.log("Current user:", user);
      console.log("User role:", user.role);
    }
  }, [user]);

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (isLoading)
      return (
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      );

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      console.log(
        `Access denied: User role ${user?.role} not in allowed roles:`,
        allowedRoles
      );
      return (
        <Navigate
          to={user?.role === "admin" ? "/admin" : "/operator"}
          replace
        />
      );
    }

    return children;
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="workflows" element={<WorkflowManagement />} />
          <Route path="trucks" element={<TruckMonitoring />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Operator Routes */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={["operator"]}>
              <OperatorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OperatorDashboard />} />
        </Route>

        {/* Redirect root to login or dashboard based on auth status */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate
                to={user?.role === "admin" ? "/admin" : "/operator"}
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
