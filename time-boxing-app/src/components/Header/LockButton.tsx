import React from "react";
import { observer } from "mobx-react-lite";
import settingsStore from "../../store/SettingsStore";
import styles from "./Header.module.css";

const LockButton: React.FC = () => {
  return (
    <button className={styles['lock-button']} onClick={() => settingsStore.toggleDragEnabled()}>
      {settingsStore.isDragEnabled ? "🔓" : "🔒"}
    </button>
  );
};

export default observer(LockButton);
