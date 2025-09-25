import { useNavigate } from "react-router-dom";

export default function TammLogo({ MaxWidth = 100 }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ width: `${MaxWidth}px`, cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      <img src={"/ProjectsImages/DubaiMarket.png"} alt="Dubai Market Logo" />
    </div>
  );
}
