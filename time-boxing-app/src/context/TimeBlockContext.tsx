import React, { createContext, useState, useContext, useEffect } from "react";
import { TimeBlock } from "../types/TimeBlock"; // Import TimeBlock class
import settingsStore from "../store/SettingsStore"; // Import SettingsStore

interface TimeBlockContextProps {
  timeBlocks: TimeBlock[];
  setTimeBlocks: (blocks: TimeBlock[]) => void;
}

const TimeBlockContext = createContext<TimeBlockContextProps | undefined>(undefined);

export const TimeBlockProvider: React.FC = ({ children }) => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);

  useEffect(() => {
    const fetchTimeBlocks = async () => {
      const storedTimeBlocks = await settingsStore.getTimeBlocks();
      setTimeBlocks(storedTimeBlocks);
    };
    fetchTimeBlocks();
  }, []);

  const updateTimeBlocks = async (blocks: TimeBlock[]) => {
    setTimeBlocks(blocks);
    await settingsStore.setTimeBlocks(blocks); // Synchronize with SettingsStore
  };

  return (
    <TimeBlockContext.Provider value={{ timeBlocks, setTimeBlocks: updateTimeBlocks }}>
      {children}
    </TimeBlockContext.Provider>
  );
};

export const useTimeBlocks = () => {
  const context = useContext(TimeBlockContext);
  if (!context) {
    throw new Error("useTimeBlocks must be used within a TimeBlockProvider");
  }
  return context;
};
