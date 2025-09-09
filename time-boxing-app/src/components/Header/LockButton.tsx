import React from "react";
import { observer } from "mobx-react-lite";
import settingsStore from "../../store/SettingsStore";
import styles from "./Header.module.css";
import { useEmojiSupport } from "../../hooks/useEmojiSupport";

const LockButton: React.FC = () => {
  const isUnlocked = settingsStore.isDragEnabled; // true means drag enabled (unlocked)
  const emojiSupported = useEmojiSupport(isUnlocked ? "🔓" : "🔒");

  const labelCurrentState = isUnlocked ? "Drag reordering enabled" : "Drag reordering locked";
  const actionHint = isUnlocked ? "Click to lock" : "Click to unlock";
  const ariaLabel = `${labelCurrentState}. ${actionHint}.`;

  return (
    <button
      className={styles['lock-button']}
      onClick={() => settingsStore.toggleDragEnabled()}
      aria-pressed={isUnlocked}
      aria-label={ariaLabel}
      title={ariaLabel}
      type="button"
    >
      {emojiSupported ? (
        <span className={styles['lock-visual']} aria-hidden="true">{isUnlocked ? "🔓" : "🔒"}</span>
      ) : (
        <span className={styles['lock-text-fallback']}>{isUnlocked ? "Unlock" : "Lock"}</span>
      )}
      {/* Always include a visually hidden textual state so screen readers have stable content even if aria-label changes */}
      <span className={styles['visually-hidden']} data-testid="lock-state-text">
        {isUnlocked ? "Unlocked" : "Locked"}
      </span>
    </button>
  );
};

export default observer(LockButton);
