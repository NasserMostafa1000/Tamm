import { FaUserCircle } from "react-icons/fa";

export default function UserAvatar({ imageUrl, size = 25 }) {
  return imageUrl ? (
    <img
      src={imageUrl}
      alt="User Avatar"
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <FaUserCircle size={size} className="text-gray-500" />
  );
}
