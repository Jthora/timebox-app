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
import TimerDisplay from "../../components/TimerDisplay/TimerDisplay";
import TimeBoxButtons from "../../components/TimeBoxButtons/TimeBoxButtons"; // Import TimeBoxButtons component
import styles from './HomePage.module.css'; // Import the CSS module
import { observer } from "mobx-react-lite";
import settingsStore from "../../store/SettingsStore"; // Import SettingsStore
import useTimeBlocks from "../../hooks/useTimeBlocks"; // Import useTimeBlocks hook
import { TimeBlock } from "../../types/TimeBlock"; // Import TimeBlock type

const HomePage: React.FC = observer(() => {
  const { timeBlocks, setTimeBlocks } = useTimeBlocks();
  const [currentTimer, setCurrentTimer] = useState<TimeBlock | null>(null);

  useEffect(() => {
    if (timeBlocks.length === 0) {
      setTimeBlocks(settingsStore.getDefaultTimeBlocks());
    } else if (!currentTimer && timeBlocks.length > 0) {
      setCurrentTimer(timeBlocks[0]); // Pre-select the top-most TimeBlock
    }
  }, [timeBlocks, setTimeBlocks, currentTimer]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!settingsStore.isDragEnabled) {
      return; // Prevent drag-and-drop if disabled
    }

    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = timeBlocks.findIndex((item) => item.id === active.id);
      const newIndex = timeBlocks.findIndex((item) => item.id === over?.id);

      const newTimeBlocks = arrayMove(timeBlocks, oldIndex, newIndex);
      setTimeBlocks(newTimeBlocks);
      settingsStore.setTimeBlocks(newTimeBlocks); // Synchronize with SettingsStore
    }
  };

  useEffect(() => {
    console.log("Current Timer:", currentTimer);
  }, [currentTimer]);

  return (
    <div className={styles['home-page']}>
      <div className={styles['time-boxes']}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={settingsStore.isDragEnabled ? undefined : []} // Disable sensors if drag-and-drop is disabled
        >
          <SortableContext
            items={timeBlocks.map((timeBlock) => timeBlock.id)} // Ensure items are IDs
            strategy={verticalListSortingStrategy}
          >
            <TimeBoxButtons
              onTimeBoxClick={(timeBlock) => {
                console.log("TimeBox clicked:", timeBlock);
                setCurrentTimer(timeBlock);
                console.log("Current Timer after click:", timeBlock);
              }}
              isDragEnabled={settingsStore.isDragEnabled}
              activeTimeBlockId={currentTimer?.id}
            />
          </SortableContext>
        </DndContext>
      </div>
      <div className={styles['timer-display']} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {currentTimer && (
          <TimerDisplay
            initialTime={currentTimer.time}
            onComplete={() => setCurrentTimer(null)}
            currentTimeBlock={currentTimer} // Pass currentTimeBlock
          />
        )}
      </div>
    </div>
  );
});

export default HomePage;