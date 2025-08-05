import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const defaultPlace = "All Emirates";

  const [currentPlace, setCurrentPlace] = useState(() => {
    return localStorage.getItem("currentPlace") || defaultPlace;
  });

  useEffect(() => {
    localStorage.setItem("currentPlace", currentPlace);
  }, [currentPlace]);

  const emirates = [
    "All Emirates",
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
  ];

  return (
    <LocationContext.Provider
      value={{ currentPlace, setCurrentPlace, emirates }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  return useContext(LocationContext);
}
