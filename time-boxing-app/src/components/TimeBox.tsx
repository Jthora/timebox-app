import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import styles from '../styles/App.module.css'; // Import the CSS module

interface TimeBoxProps {
  id: string; // Unique ID for each draggable box
  time: number; // Time in seconds
  onClick: () => void; // Click handler for the time block
  isDragEnabled: boolean; // Prop to determine if dragging is enabled
}

const TimeBox: React.FC<TimeBoxProps> = ({ id, time, onClick, isDragEnabled }) => {
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatLabel = (seconds: number) => {
    const hours = seconds / 3600;
    return hours >= 1 ? `${hours % 1 === 0 ? hours : hours.toFixed(1)} Hrs` : `${Math.floor(seconds / 60)} Mins`;
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
      {...(isDragEnabled ? listeners : {})} // Apply listeners only if dragging is enabled
      {...attributes}
      className={styles['time-box']} // Use the CSS module class
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
    >
      <button>
        <h2>{formatLabel(time)}</h2>
        <p>{formatTime(time)}</p> {/* Display the time */}
      </button>
    </div>
  );
};

export default TimeBox;