import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect if already logged in
  if (isAuthenticated) {
    return (
      <Navigate to={user?.role === "admin" ? "/admin" : "/operator"} replace />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-auto w-full max-w-md p-4 sm:p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-teal-700">PlantFlow</h1>
          <p className="text-gray-600">Truck Check-In/Check-Out System</p>
        </div>
        <div className="rounded-lg bg-white p-4 sm:p-8 shadow-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
