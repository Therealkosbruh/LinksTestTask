import React from "react";
import styles from "../css/Popup.module.css";

interface AnalyticsProps {
  analytics: { count: number; lastIps: string[] };
  onClose: () => void;
}

export default function AnalyticsPopup({ analytics, onClose }: AnalyticsProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Статистика</h2>
        <p>Количество переходов: {analytics.count}</p>
        {/* <h3>Последние IP:</h3>
        <ul>
          {analytics.lastIps.map((ip, index) => (
            <li key={index}>{ip}</li>
          ))}
        </ul> */}
        {analytics.lastIps.length > 0 && (
            <>
                <h3>Последние IP:</h3>
                <ul>
                {analytics.lastIps.map((ip, index) => (
                    <li key={index}>{ip}</li>
                ))}
                </ul>
            </>
            )}

        <button className={styles.closeIcon} onClick={onClose}> &times;</button>
      </div>
    </div>
  );
}
