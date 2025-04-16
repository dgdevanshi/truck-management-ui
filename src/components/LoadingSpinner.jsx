/**
 * A reusable loading spinner component
 */
const LoadingSpinner = ({ size = "medium", color = "teal" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const colorClasses = {
    teal: "border-teal-600 border-t-transparent",
    blue: "border-blue-600 border-t-transparent",
    gray: "border-gray-600 border-t-transparent",
  };

  return (
    <div className="flex justify-center py-4">
      <div
        className={`animate-spin rounded-full border-4 ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
