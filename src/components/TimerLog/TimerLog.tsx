import React from "react";
import { format } from "date-fns"; // Import date-fns for formatting

interface TimerLogProps {
  logs: string[];
}

const TimerLog: React.FC<TimerLogProps> = ({ logs }) => {
  const formatLog = (log: string) => {
    const [timestamp, message, timeblock] = log.split(": ");
    const formattedTimestamp = format(new Date(timestamp), "PPpp");
    return `${formattedTimestamp}: ${message} [${timeblock}]`;
  };

  if (logs.length === 0) {
    return null;
  }

  return (
    <ul>
      {logs.map((log, index) => (
        <li key={index}>{formatLog(log)}</li>
      ))}
    </ul>
  );
};

export default TimerLog;