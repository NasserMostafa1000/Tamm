import { useNavigate } from "react-router-dom";

export default function TammLogo({ MaxWidth = 100 }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ maxWidth: `${MaxWidth}px`, cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      <img
        src="/TammIcon.ico"
        alt="Tamm Logo"
        className="w-full h-auto rounded-full" // مجرد دائرة بدون أي تأثيرات
      />
    </div>
  );
}
