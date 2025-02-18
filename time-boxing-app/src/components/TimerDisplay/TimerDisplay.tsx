import React, { useEffect } from "react";
import AudioPlayer from "../../utils/AudioPlayer";
import CurrentTime from "../CurrentTime/CurrentTime";
import styles from "./TimerDisplay.module.css";
import useTimer from "../../hooks/useTimer"; // Import TimerContext
import { TimeBlock } from "../../types/TimeBlock";

interface TimerDisplayProps {
  initialTime: number;
  onComplete: () => void;
  currentTimeBlock: TimeBlock; // Add currentTimeBlock prop
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ initialTime, onComplete, currentTimeBlock }) => {
  const { timeLeft, setTimeLeft, isRunning, setIsRunning, setCurrentTimeBlock } = useTimer();

  useEffect(() => {
    console.log("TimerDisplay initialTime:", initialTime);
    console.log("TimerDisplay currentTimeBlock:", currentTimeBlock);
    if (initialTime > 0) {
      setTimeLeft(initialTime);
      setCurrentTimeBlock(currentTimeBlock); // Set currentTimeBlock
    }
  }, [initialTime, setTimeLeft, setCurrentTimeBlock, currentTimeBlock]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      onComplete();
      setIsRunning(false);
    }
  }, [timeLeft, isRunning, onComplete, setIsRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const calculateETA = (seconds: number) => {
    const endTime = new Date(Date.now() + seconds * 1000);
    return endTime.toLocaleTimeString();
  };

  return (
    <div className={styles['timer-display']}>
      <CurrentTime />
      <h1>{formatTime(timeLeft)}</h1>
      <div className={styles.timerETA}>
        {isRunning && <span>ETA: {calculateETA(timeLeft)}</span>}
      </div>
      <div>
        <button onClick={() => { setIsRunning(true); AudioPlayer.playStartSound(); }}>Start</button>
        <button onClick={() => { setIsRunning(false); AudioPlayer.stopAllSounds(); AudioPlayer.playPauseSound(); }}>Pause</button>
        <button onClick={() => { setTimeLeft(initialTime); setIsRunning(false); AudioPlayer.stopAllSounds(); AudioPlayer.playResetSound(); }}>Reset</button>
      </div>
    </div>
  );
};

export default TimerDisplay;