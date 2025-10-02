import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import HistoryPage from "../pages/HistoryPage/HistoryPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
};

export default AppRoutes;
