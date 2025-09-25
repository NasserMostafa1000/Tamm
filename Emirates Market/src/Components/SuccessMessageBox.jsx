// components/SuccessMessageBox.jsx
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SuccessMessageBox({ message }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <FaCheckCircle className="text-green-500 text-5xl" />
          <h2 className="text-xl font-bold text-gray-800">تم بنجاح</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {message}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
