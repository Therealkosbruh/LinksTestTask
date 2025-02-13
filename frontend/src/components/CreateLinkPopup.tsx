// import React, { useState } from "react";
// import styles from "../css/Popup.module.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import moment from "moment";

// export default function CreateLinkPopup({ onClose }: { onClose: () => void }) {
//   const [formData, setFormData] = useState({
//     originalUrl: "",
//     alias: "",
//     expiresAt: new Date(),
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleDateChange = (date: Date | null) => {
//     if (date) {
//       setFormData({ ...formData, expiresAt: date });
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       const response = await fetch("http://localhost:3000/url/shorten", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           originalUrl: formData.originalUrl,
//           alias: formData.alias || undefined,
//           expiresAt: moment(formData.expiresAt).format("YYYY-MM-DD HH:mm:ss"),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Не удалось создать короткую ссылку");
//       }

//       const data = await response.json();
//       setSuccessMessage(`Короткая ссылка создана: ${data.shortUrl}`);
//       setFormData({ originalUrl: "", alias: "", expiresAt: new Date() });

//     } catch (error: any) {
//       setError(error.message || "Произошла ошибка");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.popup}>
//         <div className={styles.closeIcon} onClick={onClose}>
//           &times;
//         </div>
//         <h2>Создать короткую ссылку</h2>

//         <input
//           type="text"
//           name="originalUrl"
//           placeholder="Введите оригинальный URL"
//           className={styles.inputField}
//           value={formData.originalUrl}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="alias"
//           placeholder="Введите алиас (необязательно)"
//           className={styles.inputField}
//           value={formData.alias}
//           onChange={handleChange}
//         />

//         <DatePicker
//           selected={formData.expiresAt}
//           onChange={handleDateChange}
//           showTimeSelect
//           dateFormat="yyyy-MM-dd HH:mm:ss"
//           className={styles.inputField}
//         />

//         {error && <p className={styles.error}>{error}</p>}
//         {successMessage && <p className={styles.success}>{successMessage}</p>}

//         <button
//           className={styles.createButton}
//           onClick={handleSubmit}
//           disabled={loading || !formData.originalUrl}
//         >
//           {loading ? "Создание..." : "Создать"}
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import styles from "../css/Popup.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export default function CreateLinkPopup({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    originalUrl: "",
    alias: "",
    expiresAt: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, expiresAt: date });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/url/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: formData.originalUrl,
          alias: formData.alias?.trim() || undefined, // Исправлено: передаем alias, если он есть
          expiresAt: moment(formData.expiresAt).format("YYYY-MM-DD HH:mm:ss"),
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось создать короткую ссылку");
      }

      alert("Короткая ссылка успешно создана"); // ✅ Выводим alert
      window.location.reload(); // ✅ Перезагружаем страницу

    } catch (error: any) {
      setError(error.message || "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.closeIcon} onClick={onClose}>
          &times;
        </div>
        <h2>Создать короткую ссылку</h2>

        <input
          type="text"
          name="originalUrl"
          placeholder="Введите оригинальный URL"
          className={styles.inputField}
          value={formData.originalUrl}
          onChange={handleChange}
        />
        <input
          type="text"
          name="alias"
          placeholder="Введите алиас (необязательно)"
          className={styles.inputField}
          value={formData.alias}
          onChange={handleChange}
        />

        <DatePicker
          selected={formData.expiresAt}
          onChange={handleDateChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm:ss"
          className={styles.inputField}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.createButton}
          onClick={handleSubmit}
          disabled={loading || !formData.originalUrl}
        >
          {loading ? "Создание..." : "Создать"}
        </button>
      </div>
    </div>
  );
}
