import React, { useEffect, useRef, useState } from "react";
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
        const [focusIndex, setFocusIndex] = useState(0);
        const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

        // Adjust focus index if active changes
        useEffect(() => {
            if (activeTimeBlockId) {
                const idx = timeBlocks.findIndex(tb => tb.id === activeTimeBlockId);
                if (idx >= 0) setFocusIndex(idx);
            }
        }, [activeTimeBlockId, timeBlocks]);

        useEffect(() => {
            // Focus the active or first item when list changes
            const el = buttonRefs.current[focusIndex];
            if (el) {
                // slight delay to ensure render completion
                setTimeout(() => el.focus(), 0);
            }
        }, [focusIndex, timeBlocks.length]);

        const handleKeyDown = (e: React.KeyboardEvent, index: number, timeBlock: TimeBlock) => {
            const max = timeBlocks.length - 1;
            let next = index;
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    next = index === max ? 0 : index + 1;
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    next = index === 0 ? max : index - 1;
                    e.preventDefault();
                    break;
                case 'Home':
                    next = 0; e.preventDefault(); break;
                case 'End':
                    next = max; e.preventDefault(); break;
                case 'Enter':
                case ' ': // space
                    onTimeBoxClick(timeBlock);
                    e.preventDefault();
                    return; // don't move focus unless explicitly changed
                default:
                    return;
            }
            setFocusIndex(next);
        };

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
                                        {timeBlocks.map((timeBlock, idx) => (
                            <TimeBox
                                key={timeBlock.id}
                                id={timeBlock.id}
                                time={timeBlock.time}
                                onClick={() => onTimeBoxClick(timeBlock)}
                                isDragEnabled={isDragEnabled}
                                            active={activeTimeBlockId === timeBlock.id}
                                            tabIndex={idx === focusIndex ? 0 : -1}
                                            onKeyDown={(e) => handleKeyDown(e, idx, timeBlock)}
                                            refCallback={(el: HTMLButtonElement | null) => { buttonRefs.current[idx] = el; }}
                            />
                        ))}
                    </div>
                </div>
            </SortableContext>
        </DndContext>
    );
});

export default TimeBoxButtons;
