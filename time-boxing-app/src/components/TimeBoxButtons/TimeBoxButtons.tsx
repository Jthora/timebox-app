import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { observer } from "mobx-react-lite";
import TimeBox from "../TimeBox/TimeBox";
import { TimeBlock } from "../../types/TimeBlock";
import styles from './TimeBoxButtons.module.css';
import settingsStore from "../../store/SettingsStore";

interface TimeBoxButtonsProps {
    onTimeBoxClick: (timeBlock: TimeBlock) => void;
    isDragEnabled: boolean;
    activeTimeBlockId?: string;
}

const TimeBoxButtons: React.FC<TimeBoxButtonsProps> = observer(({ onTimeBoxClick, isDragEnabled, activeTimeBlockId }) => {
    const timeBlocks = settingsStore.timeBlocks; // reactive

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = timeBlocks.findIndex(block => block.id === active.id);
            const newIndex = timeBlocks.findIndex(block => block.id === over.id);
            const newOrder = arrayMove(timeBlocks, oldIndex, newIndex);
            await settingsStore.setTimeBlocks(newOrder);
        }
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={timeBlocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
                <div className={styles.content}>
                    <div className={styles['time-box-buttons']}>
                        {timeBlocks.map(timeBlock => (
                            <TimeBox
                                key={timeBlock.id}
                                id={timeBlock.id}
                                time={timeBlock.time}
                                onClick={() => onTimeBoxClick(timeBlock)}
                                isDragEnabled={isDragEnabled}
                                active={activeTimeBlockId === timeBlock.id}
                            />
                        ))}
                    </div>
                </div>
            </SortableContext>
        </DndContext>
    );
});

export default TimeBoxButtons;
