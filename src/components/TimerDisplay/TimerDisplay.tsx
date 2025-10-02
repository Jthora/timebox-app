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

  const canStart = !isRunning && timeLeft > 0;
  const canPause = isRunning;
  const canReset = isRunning || timeLeft !== initialTime;

  const etaText = isRunning ? calculateETA(timeLeft) : "--";

  const handleStart = () => {
    if (!canStart) return;
    setIsRunning(true);
    AudioPlayer.playStartSound();
  };

  const handlePause = () => {
    if (!canPause) return;
    setIsRunning(false);
    AudioPlayer.stopAllSounds();
    AudioPlayer.playPauseSound();
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    AudioPlayer.stopAllSounds();
    AudioPlayer.playResetSound();
  };

  const statusText = isRunning
    ? `Timer running for ${currentTimeBlock.label}. ${formatTime(timeLeft)} remaining.`
    : `Timer paused for ${currentTimeBlock.label}. ${formatTime(timeLeft)} remaining.`;

  return (
    <div className={styles.timerDisplay}>
      <div className={styles.timerHeading}>
        <div className={styles.blockMeta}>
          <p className={styles.blockEyebrow}>Current block</p>
          <h2 className={styles.blockTitle}>{currentTimeBlock.label}</h2>
          <span className={styles.blockDuration}>{formatTime(initialTime)}</span>
        </div>
        <CurrentTime />
      </div>
      <div className={styles.progressWrapper}>
        <div className={styles.ringWrapper}>
          <svg
            className={styles.progressRing}
            width="100%"
            height="100%"
            viewBox="0 0 280 280"
            role="img"
            aria-label="Timer progress circular visualization"
          >
            <circle className={styles.progressRingBg} cx="140" cy="140" r="124" />
            <circle
              className={styles.progressRingFill}
              cx="140"
              cy="140"
              r="124"
              strokeDasharray={2 * Math.PI * 124}
              strokeDashoffset={(1 - progress) * 2 * Math.PI * 124}
              aria-hidden="true"
            />
          </svg>
          <div className={styles.ringCenter} aria-hidden="true">
            <span className={styles.ringTimePrimary}>{formatTime(timeLeft)}</span>
            <span className={styles.ringTimeSecondary}>
              {isRunning ? "Remaining" : "Paused"}
            </span>
          </div>
          <div
            className={styles.screenReaderProgress}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label="Timer progress"
          />
        </div>
      </div>
      <div className={styles.timerMeta}>
        <span className={styles.timerStatus}>{isRunning ? "In progress" : "Paused"}</span>
        <span className={styles.timerEtaLabel}>
          ETA: <strong>{etaText}</strong>
        </span>
      </div>
      <div className={styles.timerControls}>
        <button type="button" onClick={handleStart} disabled={!canStart}>
          Start
        </button>
        <button type="button" onClick={handlePause} disabled={!canPause}>
          Pause
        </button>
        <button type="button" onClick={handleReset} disabled={!canReset}>
          Reset
        </button>
      </div>
      <div className={styles.screenReaderStatus} aria-live="polite">
        {statusText}
      </div>
    </div>
  );
};

export default TimerDisplay;