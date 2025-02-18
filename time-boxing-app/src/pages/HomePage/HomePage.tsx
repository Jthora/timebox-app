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
import { useTimeBlocks } from "../../context/TimeBlockContext"; // Import TimeBlockContext
import { TimeBlock } from "../../types/TimeBlock"; // Import TimeBlock type

const HomePage: React.FC = observer(() => {
  const { timeBlocks, setTimeBlocks } = useTimeBlocks();
  const [currentTimer, setCurrentTimer] = useState<TimeBlock | null>(null);

  useEffect(() => {
    if (timeBlocks.length === 0) {
      setTimeBlocks(settingsStore.getDefaultTimeBlocks());
    }
  }, [timeBlocks, setTimeBlocks]);

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
                onTimeBoxClick={(timeBlock) => setCurrentTimer(timeBlock)}
                isDragEnabled={settingsStore.isDragEnabled}
              />
            </SortableContext>
          </DndContext>
        </div>
        <div className={styles['timer-display']} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <TimerDisplay
            initialTime={currentTimer ? currentTimer.time : 0}
            onComplete={() => setCurrentTimer(null)}
          />
        </div>
    </div>
  );
});

export default HomePage;