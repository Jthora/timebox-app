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
          <TimerLog logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
