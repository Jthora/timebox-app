import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TimeBox from "../TimeBox/TimeBox";
import { TimeBlock } from "../../types/TimeBlock"; // Import TimeBlock class
import styles from './TimeBoxButtons.module.css'; // Import the CSS module
import settingsStore from "../../store/SettingsStore"; // Import SettingsStore

interface TimeBoxButtonsProps {
    onTimeBoxClick: (timeBlock: TimeBlock) => void;
    isDragEnabled: boolean;
}

const TimeBoxButtons: React.FC<TimeBoxButtonsProps> = ({ onTimeBoxClick, isDragEnabled }) => {
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);

    useEffect(() => {
        const fetchTimeBlocks = async () => {
            const storedTimeBlocks = await settingsStore.getTimeBlocks();
            setTimeBlocks(storedTimeBlocks);
        };
        fetchTimeBlocks();
    }, []);

    useEffect(() => {
        const handleTimeBlocksChange = async () => {
            const updatedTimeBlocks = await settingsStore.getTimeBlocks();
            setTimeBlocks(updatedTimeBlocks);
        };

        // Subscribe to changes in SettingsStore
        const originalSetTimeBlocks = settingsStore.setTimeBlocks;
        settingsStore.setTimeBlocks = async (blocks: TimeBlock[]) => {
            await originalSetTimeBlocks.call(settingsStore, blocks);
            await handleTimeBlocksChange();
        };

        return () => {
            // Cleanup subscription if necessary
            settingsStore.setTimeBlocks = originalSetTimeBlocks;
        };
    }, []);

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = timeBlocks.findIndex(block => block.id === active.id);
            const newIndex = timeBlocks.findIndex(block => block.id === over.id);
            const newOrder = arrayMove(timeBlocks, oldIndex, newIndex);
            setTimeBlocks(newOrder);
            await settingsStore.setTimeBlocks(newOrder); // Save the new order
        }
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={timeBlocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
                <div className={styles.content}>
                    <div className={styles['time-box-buttons']}>
                        {timeBlocks.map((timeBlock) => (
                            <TimeBox
                                key={timeBlock.id}
                                id={timeBlock.id}
                                time={timeBlock.time}
                                onClick={() => onTimeBoxClick(timeBlock)}
                                isDragEnabled={isDragEnabled} // Pass the isDragEnabled prop
                            />
                        ))}
                    </div>
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default TimeBoxButtons;
