export interface UrlInfo {
    id: number;
    shortUrl: string;
    originalUrl: string;
    createdAt: string;
    expiresAt?: string | null;
    clickCount: number;
  }
  