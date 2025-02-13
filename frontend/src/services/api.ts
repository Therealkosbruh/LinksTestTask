import { UrlInfo } from "../types";

const API_URL = "http://localhost:3000/url";

export async function createShortUrl(originalUrl: string, alias?: string, expiresAt?: string): Promise<UrlInfo> {
  const response = await fetch(`${API_URL}/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalUrl, alias, expiresAt }),
  });

  if (!response.ok) {
    throw new Error("Ошибка при создании короткой ссылки");
  }
  return response.json();
}

export async function getAllUrls(): Promise<UrlInfo[]> {
  const response = await fetch(`${API_URL}/list`);
  if (!response.ok) {
    throw new Error("Ошибка при загрузке списка ссылок");
  }
  return response.json();
}

export async function getUrlInfo(shortUrl: string): Promise<UrlInfo> {
  const response = await fetch(`${API_URL}/info/${shortUrl}`);
  if (!response.ok) {
    throw new Error("Ошибка при получении информации о ссылке");
  }
  return response.json();
}

export async function deleteShortUrl(shortUrl: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/delete/${shortUrl}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Ошибка при удалении ссылки");
  }
  return response.json();
}
