import React, { useEffect, useMemo } from "react";
import AudioPlayer from "../../utils/AudioPlayer";
import CurrentTime from "../CurrentTime/CurrentTime";
import styles from "./TimerDisplay.module.css";
import useTimer from "../../hooks/useTimer"; // Import TimerContext
import { formatHMS } from "../../utils/timeFormatter";
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

  const formatTime = (seconds: number) => formatHMS(seconds);

  const calculateETA = (seconds: number) => {
    const endTime = new Date(Date.now() + seconds * 1000);
    return endTime.toLocaleTimeString();
  };

  const progress = useMemo(() => {
    if (!initialTime || initialTime <= 0) return 0;
    return Math.min(1, Math.max(0, (initialTime - timeLeft) / initialTime));
  }, [initialTime, timeLeft]);

  return (
    <div className={styles['timer-display']}>
      <CurrentTime />
      <div className={styles['progress-wrapper']}>
        <div className={styles['progress-bar']} aria-label="timer progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress*100)} role="progressbar">
          <div className={styles['progress-bar-fill']} style={{ width: `${progress * 100}%` }} />
        </div>
        <h1>{formatTime(timeLeft)}</h1>
      </div>
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