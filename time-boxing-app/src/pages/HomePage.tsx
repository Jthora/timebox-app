import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TimerLog from "../components/TimerLog";
import TimerDisplay from "../components/TimerDisplay";
import TimeBox from "../components/TimeBox";
import useLocalStorage from "../hooks/useLocalStorage"; // Import the useLocalStorage hook
import { useNavigate } from "react-router-dom";
import styles from '../styles/App.module.css'; // Import the CSS module
import logo from '../assets/images/WingCommanderLogo-288x162.gif'; // Import the image

interface TimeBlock {
  id: string;
  label: string;
  time: number;
}

interface HomePageProps {
  timeBlocks: TimeBlock[];
  setTimeBlocks: (blocks: TimeBlock[]) => void;
}

const HomePage: React.FC<HomePageProps> = ({ timeBlocks, setTimeBlocks }) => {
  const [logs, setLogs] = useLocalStorage<string[]>("logs", []);
  const [storedTimeBlocks, setStoredTimeBlocks] = useLocalStorage<TimeBlock[]>("timeBlocks", timeBlocks);
  const [currentTimer, setCurrentTimer] = useState<TimeBlock | null>(null);
  const [isDragEnabled, setIsDragEnabled] = useState(true); // State to toggle drag-and-drop
  const navigate = useNavigate();

  useEffect(() => {
    setStoredTimeBlocks(timeBlocks);
  }, [timeBlocks, setStoredTimeBlocks]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isDragEnabled) {
      return; // Prevent drag-and-drop if disabled
    }

    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = storedTimeBlocks.findIndex((item) => item.id === active.id);
      const newIndex = storedTimeBlocks.findIndex((item) => item.id === over?.id);

      const newTimeBlocks = arrayMove(storedTimeBlocks, oldIndex, newIndex);
      setStoredTimeBlocks(newTimeBlocks);
      setTimeBlocks(newTimeBlocks);
    }
  };

  const handleTimerComplete = () => {
    if (currentTimer) {
      console.log("Timer completed:", currentTimer.label);
      setLogs((prevLogs) => [
        ...prevLogs,
        `${currentTimer.label} completed at ${new Date().toLocaleTimeString()}`,
      ]);
      setCurrentTimer(null);
    }
  };

  return (
    <div className={styles['home-page']} style={{ position: 'relative' }}>
      <header className={styles['header']}>
        <div className={styles['left-section']}>
          <img src={logo} alt="Wing Commander Logo" className={styles['logo']} />
          <h1>Timebox Control</h1>
        </div>
        <div className={styles['right-section']}>
          <button className={styles['lock-button']} onClick={() => setIsDragEnabled(!isDragEnabled)}>
            {isDragEnabled ? "Lock" : "Unlock"}
          </button>
          <button className={styles['settings-button']} onClick={() => navigate("/settings")}>Settings</button>
        </div>
      </header>
      <div className={styles['content']}>
        <div className={styles['time-boxes']}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={isDragEnabled ? undefined : []} // Disable sensors if drag-and-drop is disabled
          >
            <SortableContext
              items={storedTimeBlocks}
              strategy={verticalListSortingStrategy}
            >
              {storedTimeBlocks.map((timeBlock) => (
                <TimeBox
                  key={timeBlock.id}
                  id={timeBlock.id}
                  time={timeBlock.time}
                  onClick={() => setCurrentTimer(timeBlock)}
                  isDragEnabled={isDragEnabled} // Pass the isDragEnabled prop
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div className={styles['timer-display']}>
          <TimerDisplay
            initialTime={currentTimer ? currentTimer.time : 0}
            onComplete={handleTimerComplete}
          />
        </div>
        <div className={styles['timer-log-container']}>
          <div className={styles['timer-log-sub-container']}>
            <div className={styles['timer-log']}>
              <TimerLog logs={logs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;