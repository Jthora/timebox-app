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
import useTimeBlocks from "../../hooks/useTimeBlocks"; // still used, but consider future consolidation
import { TimeBlock } from "../../types/TimeBlock"; // Import TimeBlock type

const HomePage: React.FC = observer(() => {
  const { timeBlocks, setTimeBlocks } = useTimeBlocks();
  const [currentTimer, setCurrentTimer] = useState<TimeBlock | null>(null);

  useEffect(() => {
    if (timeBlocks.length === 0) {
      setTimeBlocks(settingsStore.getDefaultTimeBlocks());
      return;
    }
    if (!currentTimer && timeBlocks.length > 0) {
      const lastId = settingsStore.getLastSelectedTimeBlockId();
      const found = lastId ? timeBlocks.find(tb => tb.id === lastId) : null;
      setCurrentTimer(found || timeBlocks[0]);
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
    <div className={styles.homePage}>
      <div className={styles.layout}>
        <section className={styles.queuePane} aria-label="Time block queue">
          <header className={styles.queueHeader}>
            <div>
              <p className={styles.queueEyebrow}>Your sessions</p>
              <h2 className={styles.queueTitle}>Time Blocks</h2>
            </div>
            <div className={styles.queueMeta}>
              <span>{timeBlocks.length} blocks</span>
              <button
                type="button"
                className={styles.queueToggle}
                role="checkbox"
                aria-checked={!settingsStore.isDragEnabled}
                onClick={() => settingsStore.toggleDragEnabled()}
              >
                <span
                  className={styles.queueToggleBox}
                  data-checked={!settingsStore.isDragEnabled}
                  aria-hidden="true"
                />
                <span className={styles.queueToggleLabel}>
                  {settingsStore.isDragEnabled ? "Unlocked" : "Locked"}
                </span>
              </button>
            </div>
          </header>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={settingsStore.isDragEnabled ? undefined : []}
          >
            <SortableContext
              items={timeBlocks.map((timeBlock) => timeBlock.id)}
              strategy={verticalListSortingStrategy}
            >
              <TimeBoxButtons
                onTimeBoxClick={async (timeBlock: TimeBlock) => {
                  console.log("TimeBox clicked:", timeBlock);
                  setCurrentTimer(timeBlock);
                  await settingsStore.setLastSelectedTimeBlockId(timeBlock.id);
                  console.log("Current Timer after click:", timeBlock);
                }}
                isDragEnabled={settingsStore.isDragEnabled}
                activeTimeBlockId={currentTimer?.id}
              />
            </SortableContext>
          </DndContext>
        </section>
        <section className={styles.timerPane} aria-live="polite" aria-atomic="true">
          {currentTimer ? (
            <TimerDisplay
              initialTime={currentTimer.time}
              onComplete={() => setCurrentTimer(null)}
              currentTimeBlock={currentTimer}
            />
          ) : (
            <div className={styles.timerEmptyState}>
              <h2>Select a time block to begin</h2>
              <p>Choose a session from the list to see its countdown and controls.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
});

export default HomePage;