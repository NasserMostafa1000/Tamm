import { useNavigate } from "react-router-dom";

export default function TammLogo({ MaxWidth = 100 }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ maxWidth: `${MaxWidth}px`, cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      <img src={"/ProjectsImages/Propz.png"} alt="Propz Logo" />
    </div>
  );
}
