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
import CurrentTime from "../components/CurrentTime"; // Import the CurrentTime component
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage";
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
  logs: string[]; // Add logs prop
  setLogs: (logs: string[]) => void; // Add setLogs prop
}

const HomePage: React.FC<HomePageProps> = ({ timeBlocks, setTimeBlocks }) => {
  const [logs, setLogs] = useState<string[]>(
    loadFromLocalStorage("logs", [])
  );
  const [currentTimer, setCurrentTimer] = useState<TimeBlock | null>(null);
  const [isDragEnabled, setIsDragEnabled] = useState(true); // State to toggle drag-and-drop
  const navigate = useNavigate();

  useEffect(() => {
    saveToLocalStorage("timeBlocks", timeBlocks);
  }, [timeBlocks]);

  useEffect(() => {
    saveToLocalStorage("logs", logs);
  }, [logs]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isDragEnabled) {
      return; // Prevent drag-and-drop if disabled
    }

    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = timeBlocks.findIndex((item) => item.id === active.id);
      const newIndex = timeBlocks.findIndex((item) => item.id === over?.id);

      const newTimeBlocks = arrayMove(timeBlocks, oldIndex, newIndex);
      setTimeBlocks(newTimeBlocks);
    }
  };

  const handleTimerComplete = () => {
    if (currentTimer) {
      console.log("Timer completed:", currentTimer.label);
      setLogs((prevLogs) => {
        const newLogs = [
          ...prevLogs,
          `${currentTimer.label} completed at ${new Date().toLocaleTimeString()}`,
        ];
        console.log("New logs:", newLogs);
        return newLogs;
      });
      setCurrentTimer(null);
    }
  };

  return (
    <div className={styles['home-page']}>
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
      <CurrentTime /> {/* Add the CurrentTime component here */}
      <div className={styles['content']}>
        <div className={styles['time-boxes']}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={isDragEnabled ? undefined : []} // Disable sensors if drag-and-drop is disabled
          >
            <SortableContext
              items={timeBlocks}
              strategy={verticalListSortingStrategy}
            >
              {timeBlocks.map((timeBlock) => (
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