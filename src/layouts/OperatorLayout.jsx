"use client";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const OperatorLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { path: "/operator", label: "Dashboard", icon: "dashboard-line" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-10 flex h-16 items-center justify-between bg-teal-800 px-4 md:px-6 text-white shadow-md">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">PlantFlow</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="mr-2 hidden text-sm font-medium md:inline-block">
            Operator
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center rounded-md px-3 py-1 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-16 flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default OperatorLayout;
