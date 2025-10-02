import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import styles from './TimeBox.module.css';
import AudioPlayer from "../../utils/AudioPlayer";

interface TimeBoxProps {
  id: string;
  time: number;
  onClick: () => void;
  isDragEnabled: boolean;
  active?: boolean;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  refCallback?: (el: HTMLButtonElement | null) => void;
}

import { formatDurationLabel, formatHMS } from "../../utils/timeFormatter";

const TimeBox: React.FC<TimeBoxProps> = ({ id, time, onClick, isDragEnabled, active = false, tabIndex = -1, onKeyDown, refCallback }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [isDragging, setIsDragging] = useState(false);

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const formatTime = (seconds: number) => formatHMS(seconds);
  const formatLabel = (seconds: number) => formatDurationLabel(seconds);

  const handleMouseDown = () => setIsDragging(false);

  const handleMouseUp = () => {
    if (!isDragging) {
      AudioPlayer.playDefaultButtonSound();
      onClick();
    }
  };

  const handleDragStart = () => setIsDragging(true);

  const classNames = [
    styles['time-box'],
    active ? styles['active'] : '',
    !isDragEnabled ? styles['drag-disabled'] : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDragEnabled ? listeners : {})}
      {...attributes}
      className={classNames}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart}
    >
      <button
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        aria-pressed={active}
        aria-label={`Time block ${formatLabel(time)} ${formatTime(time)}`}
        ref={refCallback || undefined}
      >
  <h2>{formatLabel(time)}</h2>
  <p>{formatTime(time)}</p>
      </button>
    </div>
  );
};

export default TimeBox;