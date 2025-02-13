import { Controller, Post, Get, Delete, Param, Body, NotFoundException, Res, Ip, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UrlsService } from './urls.service';
import axios from 'axios';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlsService) {}

  @Post('shorten')
  async shorten(@Body() body: { originalUrl: string; alias?: string; expiresAt?: string }) {
    return await this.urlService.createShortUrl(body.originalUrl, body.alias, body.expiresAt);
  }

  @Get('all')
  async getAllUrls() {
    return await this.urlService.getAllUrls();
  }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response, @Ip() ip: string) {
    const url = await this.urlService.findByShortUrl(shortUrl);
    if (!url) throw new NotFoundException('Short URL not found');

    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      throw new HttpException('Short URL expired', HttpStatus.GONE);
    }

    await this.urlService.trackClick(url, ip);

    try {
      await axios.get(url.originalUrl, { timeout: 5000 });
      return res.json({ originalUrl: url.originalUrl });
    } catch (error) {
      return res.json({ redirectToError: true });
    }
  }

  @Get('info/:shortUrl')
  async getInfo(@Param('shortUrl') shortUrl: string) {
    const url = await this.urlService.getUrlInfo(shortUrl);
    if (!url) throw new NotFoundException('Short URL not found');
    return {
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
    };
  }

  @Delete('delete/:shortUrl')
  async delete(@Param('shortUrl') shortUrl: string) {
    const deleted = await this.urlService.deleteUrl(shortUrl);
    if (!deleted) throw new NotFoundException('Short URL not found');
    return { message: 'Short URL deleted successfully' };
  }

  @Get('analytics/:shortUrl')
  async getAnalytics(@Param('shortUrl') shortUrl: string) {
    return await this.urlService.getAnalytics(shortUrl);
  }
}
