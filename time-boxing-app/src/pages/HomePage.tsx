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
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import styles from '../styles/App.module.css'; // Import the CSS module

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
  const [logs, setLogs] = useState<string[]>(
    loadFromLocalStorage("logs", [])
  );
  const [currentTimer, setCurrentTimer] = useState<TimeBlock | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    saveToLocalStorage("timeBlocks", timeBlocks);
  }, [timeBlocks]);

  useEffect(() => {
    saveToLocalStorage("logs", logs);
  }, [logs]);

  const handleDragEnd = (event: DragEndEvent) => {
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
      setLogs((prevLogs) => [
        ...prevLogs,
        `${currentTimer.label} completed at ${new Date().toLocaleTimeString()}`,
      ]);
      setCurrentTimer(null);
    }
  };

  return (
    <div className={styles['home-page']}>
      <header>
        <h1>Timebox Control</h1>
        <button onClick={() => navigate("/settings")}>Settings</button>
      </header>
      <div className={styles['content']}>
        <div className={styles['time-boxes']}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
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