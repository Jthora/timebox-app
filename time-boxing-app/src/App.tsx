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
    { id: "3", label: "1 Hr", time: 3600 },
    { id: "4", label: "2.5 Hrs", time: 9000 },
    { id: "5", label: "4 Hrs", time: 14400 },
  ]);
  const [logs, setLogs] = useState<string[]>([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage timeBlocks={timeBlocks} setTimeBlocks={setTimeBlocks} logs={logs} setLogs={setLogs} />} />
        <Route path="/settings" element={<SettingsPage timeBlocks={timeBlocks} setTimeBlocks={setTimeBlocks} setLogs={setLogs} />} />
      </Routes>
    </Router>
  );
};

export default App;