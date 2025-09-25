import { useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";

export default function TammLogo({ MaxWidth = 100 }) {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <div
      style={{ maxWidth: `${MaxWidth}px`, cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      <img
        src={
          isDark
            ? "/ProjectsImages/EMwhite.webp"
            : "/ProjectsImages/EmBlack.webp"
        }
        alt="Emerates Market Logo"
      />
    </div>
  );
}
