import React from "react";
import moment from "moment";
import styles from "../css/Popup.module.css";

interface LinkInfoPopupProps {
  link: {
    originalUrl: string;
    createdAt: string;
    clickCount: number;
    shortUrl: string;
  };
  onClose: () => void;
  onDelete: (shortUrl: string) => void;
}

export default function LinkInfoPopup({ link, onClose, onDelete }: LinkInfoPopupProps) {
  const formatDate = (dateString: string) => moment(dateString).format("DD.MM.YYYY HH:mm");

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.closeIcon} onClick={onClose}>
          &times;
        </div>
        <h2>Информация о ссылке</h2>
        <p><strong>Оригинальный URL:</strong></p>
        <p className={styles.originalUrl}>{link.originalUrl}</p>
        <p><strong>Дата создания:</strong> {formatDate(link.createdAt)}</p>
        <p><strong>Количество переходов:</strong> {link.clickCount}</p>
        <button className={styles.deleteButton} onClick={() => onDelete(link.shortUrl)}>Удалить</button>
      </div>
    </div>
  );
}
