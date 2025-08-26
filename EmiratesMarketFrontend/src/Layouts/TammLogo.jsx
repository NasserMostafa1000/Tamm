import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TammLogo({ MaxWidth = 100 }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative"
      style={{ maxWidth: `${MaxWidth}px`, cursor: "pointer" }}
      onClick={() => navigate("/")}
    >
      {/* دائرة متوهجة حوالين اللوجو */}
      <div className="absolute inset-0 animate-pulse-glow rounded-full z-0" />

      {/* حلقة دوارة حوالين اللوجو */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-full h-full border-[3px] border-cyan-400 rounded-full animate-spin-slow opacity-30" />
      </div>

      {/* اللوجو نفسه بشكل دائري مع تأثير motion */}
      <motion.img
        src="/TammIcon.ico"
        alt="Tamm Logo"
        className="w-full h-auto rounded-full shadow-md animate-float" // هنا بدلنا rounded-md بـ rounded-full
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 3 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
    </div>
  );
}
