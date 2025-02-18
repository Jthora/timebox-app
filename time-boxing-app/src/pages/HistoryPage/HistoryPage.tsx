import React, { useState, useEffect } from "react";
import SessionHistory from "../../components/SessionHistory/SessionHistory";
import styles from "./HistoryPage.module.css";
import { useTimer } from "../../context/TimerContext"; // Import TimerContext
import settingsStore from "../../store/SettingsStore"; // Import SettingsStore

const HistoryPage: React.FC = () => {
  const { logs, setLogs } = useTimer();
  const [sessionLogs, setSessionLogs] = useState(logs);

  useEffect(() => {
    setSessionLogs(logs);
  }, [logs]);

  const clearSessionHistory = () => {
    settingsStore.clearSessionHistory();
    setLogs([]); // Update the logs in TimerContext
  };

  return (
    <div className={styles["content"]}>
      <div className={styles["left-section"]}>
        <SessionHistory logs={sessionLogs} />
      </div>
      <div className={styles["right-section"]}>
        <button onClick={clearSessionHistory} className={styles["clear-button"]}>
          Clear Session History
        </button>
      </div>
    </div>
  );
};

export default HistoryPage;
