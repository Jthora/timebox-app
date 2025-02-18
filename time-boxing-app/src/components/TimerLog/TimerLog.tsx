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

  return (
    <div className="timer-log">
      <h3>Session History</h3>
      {logs.length === 0 ? (
        <p>No completed sessions yet.</p>
      ) : (
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{formatLog(log)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimerLog;