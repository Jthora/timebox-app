import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";

interface TimeBlock {
  id: string;
  label: string;
  time: number;
}

const App: React.FC = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    { id: "1", label: "15 mins", time: 900 },
    { id: "2", label: "30 mins", time: 1800 },
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage timeBlocks={timeBlocks} setTimeBlocks={setTimeBlocks} />} />
        <Route path="/settings" element={<SettingsPage timeBlocks={timeBlocks} setTimeBlocks={setTimeBlocks} />} />
      </Routes>
    </Router>
  );
};

export default App;