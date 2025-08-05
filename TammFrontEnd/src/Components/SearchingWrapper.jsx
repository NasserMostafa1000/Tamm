import { useLocation } from "react-router-dom";
import Searching from "../Pages/SearchingPage";
import NavBar from "./NavBar";

export default function SearchingWrapper() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  return (
    <div>
      <Searching searchTerm={searchTerm} />
    </div>
  );
}
