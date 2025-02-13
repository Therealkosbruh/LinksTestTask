import React from "react";
import styles from "../css/Error.module.css";

export default function Error() {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.message}>Страница не найдена</p>
    </div>
  );
}
