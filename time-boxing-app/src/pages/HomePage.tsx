import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TimerLog from "../components/TimerLog";
import TimerDisplay from "../components/TimerDisplay";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage";

interface TimeBlock {
  id: string;
  label: string;
  time: number;
}

interface TimeBlockWithClick extends TimeBlock {
  onClick: () => void;
}

const SortableTimeBox: React.FC<TimeBlockWithClick> = ({ id, label, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="time-box"
      onClick={onClick}
    >
      {label}
    </div>
  );
};

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
    <div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={timeBlocks.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="time-boxes">
            {timeBlocks.map((block) => (
              <SortableTimeBox
                key={block.id}
                {...block}
                onClick={() => setCurrentTimer(block)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {currentTimer && (
        <TimerDisplay
          initialTime={currentTimer.time}
          onComplete={handleTimerComplete}
        />
      )}
      <TimerLog logs={logs} />
    </div>
  );
};

export default HomePage;