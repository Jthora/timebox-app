import React from "react";

interface TimerLogProps {
  logs: string[];
}

const TimerLog: React.FC<TimerLogProps> = ({ logs }) => (
  <div className="timer-log">
    <h3>Session History</h3>
    {logs.length === 0 ? (
      <p>No completed sessions yet.</p>
    ) : (
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    )}
  </div>
);

export default TimerLog;