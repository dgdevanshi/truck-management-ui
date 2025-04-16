"use client";

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

/**
 * A mobile-friendly navigation menu component
 */
const MobileMenu = ({ links, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (isOpen && event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        className="mobile-menu-button p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        {isOpen ? (
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

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="mobile-menu fixed right-0 top-0 h-full w-64 bg-teal-800 p-4 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <nav className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/admin" || link.path === "/operator"}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-teal-700 text-white"
                        : "text-teal-100 hover:bg-teal-700 hover:text-white"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <i className={`ri-${link.icon} mr-3 text-lg`}></i>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 w-full border-t border-teal-700 p-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-teal-100 hover:bg-teal-700 hover:text-white"
              >
                <i className="ri-logout-box-line mr-3 text-lg"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
