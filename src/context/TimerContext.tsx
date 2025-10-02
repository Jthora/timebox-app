import React, { createContext, useState, useEffect } from "react";
import { TimeBlock } from "../types/TimeBlock"; // Import TimeBlock type
import AudioPlayer from "../utils/AudioPlayer"; // Import AudioPlayer
import settingsStore from "../store/SettingsStore"; // Import SettingsStore
import GlobalTimer from "../utils/GlobalTimer"; // Import GlobalTimer

interface TimerContextProps {
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  handleTimerComplete: (currentTimer: TimeBlock) => void;
  logs: string[];
  setLogs: (logs: string[]) => void;
  setCurrentTimeBlock: (timeBlock: TimeBlock) => void;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentTimeBlock, setCurrentTimeBlock] = useState<TimeBlock | null>(null);

  useEffect(() => {
    const globalTimer = GlobalTimer.getInstance();

    const handleTick = (timeLeft: number) => {
      setTimeLeft(timeLeft);
    };

    const handleComplete = (completedTimeBlock: TimeBlock) => {
      setIsRunning(false);
      handleTimerComplete(completedTimeBlock);
    };

    if (isRunning && currentTimeBlock) {
      globalTimer.start(timeLeft, currentTimeBlock, handleTick, handleComplete);
    } else {
      globalTimer.stop();
    }

    return () => {
      globalTimer.stop();
    };
  }, [isRunning, timeLeft, currentTimeBlock]);

  const handleTimerComplete = async (completedTimeBlock: TimeBlock) => {
    console.log("handleTimerComplete:", completedTimeBlock);
    console.log("Timer completed:", completedTimeBlock.label);
    const newLog = `Completed: ${completedTimeBlock.label}`;
    await settingsStore.addLog(newLog);
    setLogs((prevLogs) => [...prevLogs, newLog]);
    console.log("Log added:", newLog);
    AudioPlayer.playCompleteSound(); // Play complete sound
  };

  return (
    <TimerContext.Provider value={{ timeLeft, setTimeLeft, isRunning, setIsRunning, handleTimerComplete, logs, setLogs, setCurrentTimeBlock }}>
      {children}
    </TimerContext.Provider>
  );
};

export { TimerContext }; // Export TimerContext
