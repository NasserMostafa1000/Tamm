import { FaBullhorn } from "react-icons/fa";

export default function CustomButton({
  text,
  onClick,
  className = "",
  icon: Icon = FaBullhorn,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-medium shadow-md transition duration-200 ${className}`}
    >
      {Icon && <Icon className="text-lg" />}
      <span>{text}</span>
    </button>
  );
}
