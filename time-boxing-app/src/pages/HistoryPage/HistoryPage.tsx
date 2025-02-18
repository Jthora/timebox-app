import React, { useState, useEffect } from "react";
import SessionHistory from "../../components/SessionHistory/SessionHistory";
import styles from "./HistoryPage.module.css";
import settingsStore from "../../store/SettingsStore"; // Import SettingsStore

const HistoryPage: React.FC = () => {
  const [sessionLogs, setSessionLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const logs = settingsStore.getLogs();
      setSessionLogs(logs);
    };
    fetchLogs();
  }, []);

  const clearSessionHistory = async () => {
    await settingsStore.clearSessionHistory();
    setSessionLogs([]);
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
