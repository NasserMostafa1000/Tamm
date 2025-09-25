// LoadingSpinner.jsx
import "../styles/LoadingSpinner.css";

export default function LoadingSpinner({ label = "جاري التحميل..." }) {
  return (
    <div className="loading-overlay">
      <p className="text-lg font-semibold text-yellow-500 mb-6 animate-pulse">
        {label}
      </p>
      <div className="spinner"></div>
    </div>
  );
}
