import React, { useState, useEffect } from "react";

interface TimerDisplayProps {
  initialTime: number; // Time in seconds
  onComplete: () => void; // Callback when the timer finishes
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ initialTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(false); // Reset to paused state when the timer changes
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="timer-display">
      <h1>{formatTime(timeLeft)}</h1>
      <div>
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button onClick={() => setTimeLeft(initialTime)}>Reset</button>
      </div>
    </div>
  );
};

export default TimerDisplay;