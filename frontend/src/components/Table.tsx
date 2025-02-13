import React, { useEffect, useState } from "react";
import moment from "moment";
import styles from "../css/Table.module.css";
import LinkInfoPopup from "./LinkInfoPopup";
import AnalyticsPopup from "./AnalyticsPopup";

interface UrlData {
  id: number;
  shortUrl: string;
  originalUrl: string;
  alias?: string;
  createdAt: string;
  expiresAt?: string;
}

interface LinkInfo {
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  shortUrl: string;
}

export default function Table() {
  const [links, setLinks] = useState<UrlData[]>([]);
  const [selectedLink, setSelectedLink] = useState<LinkInfo | null>(null);
  const [selectedAnalytics, setSelectedAnalytics] = useState<{ count: number; lastIps: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLinks = () => {
    fetch("http://localhost:3000/url/all")
      .then((response) => response.json())
      .then((data) => setLinks(data))
      .catch((error) => console.error("Error fetching URLs:", error));
  };

  useEffect(() => {
    fetchLinks();
  }, []);

 
  const handleShortUrlClick = async (event: React.MouseEvent, shortUrl: string) => {
    event.stopPropagation();
    try {
      const response = await fetch(`http://localhost:3000/url/${shortUrl}`, { method: "HEAD" });
      if (response.status === 404) {
        window.location.href = "/error"; 
        return;
      }
      if (!response.ok) throw new Error("Ошибка при переходе");
      window.open(`http://localhost:3000/url/${shortUrl}`, "_blank");
      } catch (error) {
        window.location.href = "/error"; 
      }
  };
  
  const handleRowClick = async (link: UrlData) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/url/info/${link.shortUrl}`);
      if (!response.ok) throw new Error("Failed to fetch link info");

      const data = await response.json();
      setSelectedLink({ ...data, shortUrl: link.shortUrl });
    } catch (error) {
      console.error("Ошибка получения информации о ссылке:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (shortUrl: string) => {
    fetch(`http://localhost:3000/url/delete/${shortUrl}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete link");
        return response.json();
      })
      .then(() => {
        alert("Ссылка удалена");
        setSelectedLink(null);
        fetchLinks();
      })
      .catch((error) => console.error("Error deleting link:", error));
  };

  const handleShowAnalytics = (shortUrl: string) => {
    fetch(`http://localhost:3000/url/analytics/${shortUrl}`)
      .then((response) => response.json())
      .then((data) => setSelectedAnalytics(data))
      .catch((error) => console.error("Ошибка получения статистики:", error));
  };

  const formatDate = (dateString: string | undefined) => {
    return dateString ? moment(dateString).format("DD.MM.YYYY HH:mm") : "-";
  };

  return (
    <div className={styles.container}>
      {links.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Короткая ссылка</th>
              <th>Алиас</th>
              <th>Дата создания</th>
              <th>Дата исчезновения</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {links.map((item) => (
              <tr key={item.id} className={styles.row} onClick={() => handleRowClick(item)}>
                <td>
                  <span 
                    className={styles.shortUrl} 
                    onClick={(e) => handleShortUrlClick(e, item.shortUrl)}
                  >
                    {item.shortUrl}
                  </span>
                </td>
                <td>{item.alias ? item.alias : "-"}</td>
                <td>{formatDate(item.createdAt)}</td>
                <td>{formatDate(item.expiresAt)}</td>
                <td>
                  <button 
                    className={styles.analyticsButton} 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleShowAnalytics(item.shortUrl);
                    }}
                  >
                    Статистика
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h2 className={styles.noData}>Данные отсутствуют</h2>
      )}

      {loading && <p>Загрузка...</p>}

      {selectedLink && (
        <LinkInfoPopup 
          link={selectedLink} 
          onClose={() => setSelectedLink(null)} 
          onDelete={handleDelete}
        />
      )}

      {selectedAnalytics && (
        <AnalyticsPopup 
          analytics={selectedAnalytics} 
          onClose={() => setSelectedAnalytics(null)} 
        />
      )}
    </div>
  );
}
