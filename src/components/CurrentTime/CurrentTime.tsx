import React, { useState, useEffect } from "react";
import styles from "./CurrentTime.module.css";

const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      };
      setCurrentTime(now.toLocaleTimeString(undefined, options));
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.currentTime}>
      {currentTime}
    </div>
  );
};

export default CurrentTime;