import React from "react";
import { useSortable } from "@dnd-kit/sortable";

interface TimeBoxProps {
  id: string; // Unique ID for each draggable box
  label: string; // Label for the time block
  time: number; // Time in seconds
}

const TimeBox: React.FC<TimeBoxProps> = ({ id, label, time }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="time-box"
    >
      <h2>{label}</h2>
      <p>{formatTime(time)}</p> {/* Display the time */}
    </div>
  );
};

export default TimeBox;