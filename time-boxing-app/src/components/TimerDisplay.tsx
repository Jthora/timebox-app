import React, { useState, useEffect } from "react";
import AudioPlayer from "../utils/AudioPlayer";
import CurrentTime from "./CurrentTime";

interface TimerDisplayProps {
  initialTime: number;
  onComplete: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ initialTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(false);
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
          AudioPlayer.playCompleteSound();
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
      <CurrentTime />
      <h1>{formatTime(timeLeft)}</h1>
      <div>
        <button onClick={() => { setIsRunning(true); AudioPlayer.playStartSound(); }}>Start</button>
        <button onClick={() => { setIsRunning(false); AudioPlayer.stopAllSounds(); AudioPlayer.playPauseSound(); }}>Pause</button>
        <button onClick={() => { setTimeLeft(initialTime); setIsRunning(false); AudioPlayer.stopAllSounds(); AudioPlayer.playResetSound(); }}>Reset</button>
      </div>
    </div>
  );
};

export default TimerDisplay;