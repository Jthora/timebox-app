import React from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite"; // Import observer
import styles from "./Header.module.css";
import logo from '../../assets/images/WingCommanderLogo-288x162.gif';
import LockButton from "./LockButton"; // Import LockButton

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className={styles['header']}>
      <div className={styles['left-section']}>
        <img src={logo} alt="Wing Commander Logo" className={styles['logo']} />
        <h1>Timebox Control</h1>
      </div>
      <div className={styles['right-section']}>
        <button className={styles['nav-button']} onClick={() => navigate("/")}>Home</button>
        <button className={styles['nav-button']} onClick={() => navigate("/settings")}>Settings</button>
        <button className={styles['nav-button']} onClick={() => navigate("/history")}>History</button>
        <LockButton /> {/* Use LockButton component */}
      </div>
    </header>
  );
};

export default observer(Header); // Wrap with observer
