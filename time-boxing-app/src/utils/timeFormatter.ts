// Returns MM:SS if < 1 hour, otherwise H:MM:SS (no leading zero hours)
export const formatHMS = (seconds: number): string => {
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

// Friendly label used for time block cards (e.g., 15 mins, 2.5 hrs)
export const formatDurationLabel = (seconds: number): string => {
  const hours = seconds / 3600;
  if (hours >= 1) {
    return hours % 1 === 0 ? `${hours} hr${hours === 1 ? '' : 's'}` : `${hours.toFixed(1)} hrs`;
  }
  const mins = Math.round(seconds / 60);
  return `${mins} min${mins === 1 ? '' : 's'}`;
};

// Backwards compatibility for previous import name
export const formatTime = formatHMS;
