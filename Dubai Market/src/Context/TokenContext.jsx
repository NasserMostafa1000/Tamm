import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(
    () => localStorage.getItem("userToken") || ""
  );
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (userToken) {
      localStorage.setItem("userToken", userToken);
      try {
        const decoded = jwtDecode(userToken);
        setUserId(decoded.sub || decoded.nameid || decoded.userId || null);
      } catch {
        setUserId(null);
      }
    } else {
      localStorage.removeItem("userToken");
      setUserId(null);
    }
  }, [userToken]);

  return (
    <AuthContext.Provider value={{ userToken, setUserToken, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
