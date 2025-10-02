import React from "react";
import TimerLog from "../TimerLog/TimerLog";
import styles from "./SessionHistory.module.css";

interface SessionHistoryProps {
  logs: string[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ logs }) => {
  return (
    <div className={styles['timer-log-container']}>
      <div className={styles['timer-log-sub-container']}>
        <div className={styles['timer-log']}>
          <h3>Session History</h3>
          {logs.length === 0 ? (
            <div className={styles['timer-log-empty']}>No completed sessions yet.</div>
          ) : (
            <TimerLog logs={logs} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
