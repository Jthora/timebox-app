import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import styles from '../styles/App.module.css'; // Import the CSS module

interface TimeBoxProps {
  id: string; // Unique ID for each draggable box
  label: string; // Label for the time block
  time: number; // Time in seconds
  onClick: () => void; // Click handler for the time block
}

const TimeBox: React.FC<TimeBoxProps> = ({ id, label, time, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [isDragging, setIsDragging] = useState(false);

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    if (!isDragging) {
      onClick();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={styles['time-box']} // Use the CSS module class
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
    >
      <button>
        <h2>{label}</h2>
        <p>{formatTime(time)}</p> {/* Display the time */}
      </button>
    </div>
  );
};

export default TimeBox;