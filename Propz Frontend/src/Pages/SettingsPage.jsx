// Pages/SettingsPage.jsx

import React from "react";
import SettingsPanel from "../Components/SettingsPanel";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex justify-center items-start pt-20 bg-gray-100 dark:bg-gray-900">
      <div className="relative">
        <SettingsPanel />
      </div>
    </div>
  );
}
