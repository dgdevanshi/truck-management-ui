"use client";

import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { path: "/admin", label: "Dashboard", icon: "grid-2" },
    { path: "/admin/users", label: "Users", icon: "users" },
    { path: "/admin/workflows", label: "Workflows", icon: "git-branch" },
    { path: "/admin/trucks", label: "Trucks", icon: "truck" },
    { path: "/admin/reports", label: "Reports", icon: "chart-bar" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for tablet and desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-teal-800 transition-transform duration-300 md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b border-teal-700">
          <h1 className="text-xl font-bold text-white">PlantFlow Admin</h1>
        </div>
        <nav className="mt-5 px-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              className={({ isActive }) =>
                `mb-1 flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-teal-700 text-white"
                    : "text-teal-100 hover:bg-teal-700 hover:text-white"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className={`ri-${link.icon} mr-3 text-lg`}></i>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-teal-700 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-teal-100 hover:bg-teal-700 hover:text-white"
          >
            <i className="ri-logout-box-line mr-3 text-lg"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between bg-white px-4 md:px-6 shadow-sm">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 md:hidden"
            aria-label="Toggle sidebar"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
          <div className="ml-auto flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-700">
              Admin
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
              <i className="ri-user-line"></i>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
          role="button"
          tabIndex={0}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
