import React, { createContext, useState, useContext } from "react";
import { TimeBlock } from "../types/TimeBlock"; // Import TimeBlock type

interface TimerContextProps {
  logs: string[];
  setLogs: (logs: string[]) => void;
  handleTimerComplete: (currentTimer: TimeBlock | null) => void;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider: React.FC = ({ children }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const handleTimerComplete = (currentTimer: TimeBlock | null) => {
    if (currentTimer) {
      console.log("Timer completed:", currentTimer.label);
      setLogs((prevLogs) => [
        ...prevLogs,
        `${currentTimer.label} completed at ${new Date().toLocaleTimeString()}`,
      ]);
    }
  };

  return (
    <TimerContext.Provider value={{ logs, setLogs, handleTimerComplete }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
