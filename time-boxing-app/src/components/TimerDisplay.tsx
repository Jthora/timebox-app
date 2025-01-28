import React, { useState, useEffect } from "react";
import useAudio from "../hooks/useAudio";
import CurrentTime from "./CurrentTime"; // Import the CurrentTime component

interface TimerDisplayProps {
  initialTime: number; // Time in seconds
  onComplete: () => void; // Callback when the timer finishes
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ initialTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const [, playCompleteSound] = useAudio("/src/components/sounds/soft-attack-alert.wav");
  const [, playStartSound] = useAudio("/src/components/sounds/sweetalertsound1.wav");
  const [, playPauseSound] = useAudio("/src/components/sounds/microwave-beep.wav");
  const [, playResetSound] = useAudio("/src/components/sounds/microwave-beep.wav");

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(false); // Reset to paused state when the timer changes
  }, [initialTime]);

  useEffect(() => {
    if (initialTime === 0) {
      onComplete();
    }
  }, [initialTime, onComplete]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          playCompleteSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, playCompleteSound]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="timer-display">
      <CurrentTime /> {/* Add the CurrentTime component here */}
      <h1>{formatTime(timeLeft)}</h1>
      <div>
        <button onClick={() => { setIsRunning(true); playStartSound(); }}>Start</button>
        <button onClick={() => { setIsRunning(false); playPauseSound(); }}>Pause</button>
        <button onClick={() => { setTimeLeft(initialTime); setIsRunning(false); playResetSound(); }}>Reset</button>
      </div>
    </div>
  );
};

export default TimerDisplay;