import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from '../urls/urls.controller';
import { UrlsService } from '../urls/urls.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

const mockUrlService = {
  createShortUrl: jest.fn(),
  findByShortUrl: jest.fn(),
  trackClick: jest.fn(),
};

describe('UrlController', () => {
  let app: INestApplication;
  let controller: UrlController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [{ provide: UrlsService, useValue: mockUrlService }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    controller = moduleRef.get<UrlController>(UrlController);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /url/shorten - Создание ссылки с уникальным alias', async () => {
    const mockUrl = {
      id: 1,
      shortUrl: 'abc123',
      originalUrl: 'https://example.com',
      alias: 'myalias',
      expiresAt: null,
      createdAt: new Date().toISOString(),
      clickCount: 0,
    };

    mockUrlService.createShortUrl.mockResolvedValue(mockUrl);

    await request(app.getHttpServer())
      .post('/url/shorten')
      .send({ originalUrl: 'https://example.com', alias: 'myalias' })
      .expect(201)
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: mockUrl.id,
            shortUrl: mockUrl.shortUrl,
            alias: mockUrl.alias,
            originalUrl: mockUrl.originalUrl,
            expiresAt: null,
            createdAt: expect.any(String),
            clickCount: 0,
          })
        );
      });
  });

  it('GET /url/:shortUrl - Переадресация на оригинальный URL', async () => {
    const mockUrl = {
      id: 1,
      shortUrl: 'abc123',
      originalUrl: 'https://example.com',
    };

    mockUrlService.findByShortUrl.mockResolvedValue(mockUrl);

    await request(app.getHttpServer())
      .get('/url/abc123')
      .expect(302)
      .expect('Location', 'https://example.com');
  });

  it('GET /url/:shortUrl - Ошибка, если URL не найден', async () => {
    mockUrlService.findByShortUrl.mockResolvedValue(null);

    await request(app.getHttpServer())
      .get('/url/nonexistent')
      .expect(404);
  });

  it('GET /url/:shortUrl - Ошибка, если URL истек', async () => {
    const expiredUrl = {
      id: 1,
      shortUrl: 'expired123',
      originalUrl: 'https://example.com',
      expiresAt: new Date(Date.now() - 10000),
    };

    mockUrlService.findByShortUrl.mockResolvedValue(expiredUrl);

    await request(app.getHttpServer())
      .get('/url/expired123')
      .expect(410);
  });
});
