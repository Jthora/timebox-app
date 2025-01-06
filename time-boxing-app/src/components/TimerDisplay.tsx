import React from "react";
import { useTimer } from "../hooks/useTimer";

interface TimerDisplayProps {
  initialTime: number; // Time in seconds
  onComplete: () => void; // Callback when the timer ends
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ initialTime, onComplete }) => {
  const { timeLeft, isRunning, start, pause, reset } = useTimer(initialTime);

  React.useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="timer-display">
      <h1>{formatTime(timeLeft)}</h1>
      <div>
        <button onClick={start} disabled={isRunning}>Start</button>
        <button onClick={pause} disabled={!isRunning}>Pause</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default TimerDisplay;