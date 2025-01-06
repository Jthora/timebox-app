import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SettingsPage.module.css";

interface TimeBlock {
  id: string; // Unique ID for each time block
  time: number; // Time in seconds
  label: string; // Label for the block
}

interface SettingsPageProps {
  timeBlocks: TimeBlock[];
  setTimeBlocks: (blocks: TimeBlock[]) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ timeBlocks, setTimeBlocks }) => {
  const [newTime, setNewTime] = useState("");
  const navigate = useNavigate();

  const addBlock = () => {
    const parsedTime = parseInt(newTime);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      alert("Please enter a valid positive number!");
      return;
    }
    setTimeBlocks([
      ...timeBlocks,
      { id: `${Date.now()}`, time: parsedTime * 60, label: `${parsedTime} mins` },
    ]);
    setNewTime("");
  };

  const deleteBlock = (index: number) => {
    setTimeBlocks(timeBlocks.filter((_, i) => i !== index));
  };

  return (
    <div className={styles["settings-page"]}>
      <div className={styles["left-panel"]}>
        <h1>Settings</h1>
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
        <button onClick={() => navigate("/")}>Done</button>
      </div>
    </div>
  );
};

export default SettingsPage;