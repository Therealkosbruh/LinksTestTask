import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { ClickAnalytics } from '../click-analytic/click-analytic.entity';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(ClickAnalytics)
    private readonly clickAnalyticsRepository: Repository<ClickAnalytics>,
  ) {}

  async getAllUrls(): Promise<Url[]> {
    return await this.urlRepository.find();
  }
  
  async createShortUrl(originalUrl: string, alias?: string, expiresAt?: string | Date): Promise<any> {
    const shortUrl = uuidv4().slice(0, 6); 
    const expirationDate = expiresAt ? new Date(expiresAt) : undefined;

    const url = this.urlRepository.create({
      originalUrl,
      shortUrl,
      alias: alias || null, 
      expiresAt: expirationDate,
    });

    const savedUrl = await this.urlRepository.save(url);

    return {
      id: savedUrl.id,
      shortUrl: savedUrl.shortUrl,
      alias: savedUrl.alias, 
      originalUrl: savedUrl.originalUrl,
      expiresAt: savedUrl.expiresAt ? moment(savedUrl.expiresAt).format('YYYY-MM-DD HH:mm:ss') : null,
      createdAt: moment(savedUrl.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      clickCount: savedUrl.clickCount,
    };
  }

  async findByShortUrl(shortUrl: string): Promise<Url | null> {
    return await this.urlRepository.findOne({ where: { shortUrl } });
  }

  async trackClick(url: Url, ipAddress: string): Promise<void> {
    url.clickCount += 1;
    await this.urlRepository.save(url);

    const clickRecord = this.clickAnalyticsRepository.create({ 
      url, 
      ipAddress 
    });

    await this.clickAnalyticsRepository.save(clickRecord);
  }

  async getUrlInfo(shortUrl: string): Promise<Url | null> {
    return await this.urlRepository.findOne({ where: { shortUrl } });
  }

  async deleteUrl(shortUrl: string): Promise<boolean> {
    const result = await this.urlRepository.delete({ shortUrl });
    return result.affected !== 0;
  }

  async getAnalytics(shortUrl: string): Promise<{ count: number; lastIps: string[] }> {
    const url = await this.urlRepository.findOne({ 
      where: { shortUrl },
      relations: ['clicks'],
    });

    if (!url) throw new NotFoundException("Short URL not found");

    const lastClicks = url.clicks
      .sort((a, b) => b.clickedAt.getTime() - a.clickedAt.getTime())
      .slice(0, 5);

    return { count: url.clickCount, lastIps: lastClicks.map((click) => click.ipAddress) };
  }
}
