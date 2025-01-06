import React, { useState } from "react";

interface TimeBlock {
  id: string; // Unique ID for each time block
  time: number; // Time in seconds
  label: string; // Label for the block
}

interface EditModeProps {
  timeBlocks: TimeBlock[];
  setTimeBlocks: (blocks: TimeBlock[]) => void;
}

const EditMode: React.FC<EditModeProps> = ({ timeBlocks, setTimeBlocks }) => {
  const [newTime, setNewTime] = useState("");

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
    <div className="edit-mode">
      <ul>
        {timeBlocks.map((block, index) => (
          <li key={block.id}>
            <span>{block.label}</span>
            <button onClick={() => deleteBlock(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="number"
        value={newTime}
        onChange={(e) => setNewTime(e.target.value)}
        placeholder="Add time in minutes"
      />
      <button onClick={addBlock}>Add Time Block</button>
    </div>
  );
};

export default EditMode;