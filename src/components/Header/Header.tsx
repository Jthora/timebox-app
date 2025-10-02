import React from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite"; // Import observer
import styles from "./Header.module.css";
import logo from '../../assets/images/WingCommanderLogo-288x162.gif';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className={styles['header']}>
      <div className={styles['left-section']}>
        <a
          href="https://archangel.agency"
          target="_blank"
          rel="noreferrer noopener"
          className={styles['logoLink']}
          aria-label="Visit Archangel Agency"
        >
          <img src={logo} alt="Wing Commander Logo" className={styles['logo']} />
        </a>
        <h1 className={styles['title']}>Timebox Control</h1>
      </div>
      <div className={styles['right-section']}>
        <button className={styles['nav-button']} onClick={() => navigate("/")}>Home</button>
        <button className={styles['nav-button']} onClick={() => navigate("/settings")}>Settings</button>
        <button className={styles['nav-button']} onClick={() => navigate("/history")}>History</button>
      </div>
    </header>
  );
};

export default observer(Header); // Wrap with observer
