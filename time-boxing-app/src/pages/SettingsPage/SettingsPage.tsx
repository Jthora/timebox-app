import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SettingsPage.module.css";
import settingsStore from "../../store/SettingsStore"; // Import SettingsStore
import { TimeBlock } from "../../types/TimeBlock"; // Import TimeBlock class

const SettingsPage: React.FC = () => {
  const [newTime, setNewTime] = useState("");
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchTimeBlocks = async () => {
      const storedTimeBlocks = await settingsStore.getTimeBlocks();
      setTimeBlocks(storedTimeBlocks);
    };
    fetchTimeBlocks();
  }, []);

  useEffect(() => {
    const saveTimeBlocks = async () => {
      await settingsStore.setTimeBlocks(timeBlocks);
    };
    if (timeBlocks.length > 0) {
      saveTimeBlocks();
    }
  }, [timeBlocks]);

  useEffect(() => {
    setNewTime("");
  }, [location.pathname]);

  const addBlock = async () => {
    const parsedTime = parseInt(newTime);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      alert("Please enter a valid positive number!");
      return;
    }
    const newBlock = new TimeBlock(`${Date.now()}`, parsedTime * 60, `${parsedTime} mins`);
    const newBlocks = [...timeBlocks, newBlock];
    setTimeBlocks(newBlocks);
    await settingsStore.setTimeBlocks(newBlocks); // Synchronize with SettingsStore
    setNewTime("");
  };

  const deleteBlock = async (index: number) => {
    const newBlocks = timeBlocks.filter((_, i) => i !== index);
    setTimeBlocks(newBlocks);
    await settingsStore.setTimeBlocks(newBlocks); // Synchronize with SettingsStore
  };

  return (
    <div className={styles["settings-page"]}>
      <div className={styles["content"]}>
        <div className={styles["left-panel"]}>
          <ul>
            {timeBlocks.map((block, index) => (
              <li key={block.id}>
                <span>{block.label}</span>
                <button onClick={() => deleteBlock(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles["right-panel"]}>
          <input
            type="number"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="Add time in minutes"
          />
          <button onClick={addBlock}>Add Time Block</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;