import { useState } from "react";
import styles from "../css/Header.module.css";
import CreateLinkPopup from "./CreateLinkPopup";

export default function Header() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <header className={styles.header}>
      <button className={styles.addBtn} onClick={() => setIsPopupOpen(true)}>
        Создать
      </button>
      {isPopupOpen && <CreateLinkPopup onClose={() => setIsPopupOpen(false)} />}
    </header>
  );
}
