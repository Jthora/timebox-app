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
import EditMode from "../components/EditMode";
import TimeBox from "../components/TimeBox";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage";
import styles from '../styles/App.module.css'; // Import the CSS module

interface TimeBlock {
  id: string;
  label: string;
  time: number;
}

const HomePage: React.FC = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(
    loadFromLocalStorage("timeBlocks", [
      { id: "1", label: "15 mins", time: 900 },
      { id: "2", label: "30 mins", time: 1800 },
    ])
  );

  const [logs, setLogs] = useState<string[]>(
    loadFromLocalStorage("logs", [])
  );
  const [currentTimer, setCurrentTimer] = useState<TimeBlock | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

      setTimeBlocks((items) => arrayMove(items, oldIndex, newIndex));
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
        <h1>Timebox App</h1>
        <button onClick={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </header>
      <div className={styles['content']}>
        <div className={styles['time-boxes']}>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={timeBlocks.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {timeBlocks.map((block) => (
                <TimeBox
                  key={block.id}
                  {...block}
                  onClick={() => !isEditMode && setCurrentTimer(block)}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isEditMode && (
            <EditMode timeBlocks={timeBlocks} setTimeBlocks={setTimeBlocks} />
          )}
        </div>
        <div className={styles['timer-display']}>
          {currentTimer && (
            <TimerDisplay
              initialTime={currentTimer.time}
              onComplete={handleTimerComplete}
            />
          )}
        </div>
        <div className={styles['timer-controls']}>
          <TimerLog logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;