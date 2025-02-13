import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from '../urls/urls.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from '../urls/url.entity';
import { ClickAnalytics } from '../click-analytic/click-analytic.entity';

const mockUrlRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockClickAnalyticsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

describe('UrlsService', () => {
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: getRepositoryToken(Url), useValue: mockUrlRepository },
        { provide: getRepositoryToken(ClickAnalytics), useValue: mockClickAnalyticsRepository },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('Создание ссылки с уникальным alias', async () => {
    const mockUrl = {
      id: 1,
      shortUrl: 'abc123',
      originalUrl: 'https://example.com',
      alias: 'myalias',
      expiresAt: null,
      createdAt: new Date(),
      clickCount: 0,
    };

    mockUrlRepository.create.mockReturnValue(mockUrl);
    mockUrlRepository.save.mockResolvedValue(mockUrl);

    const result = await service.createShortUrl(mockUrl.originalUrl, 'myalias');

    expect(mockUrlRepository.create).toHaveBeenCalledWith({
      originalUrl: 'https://example.com',
      shortUrl: expect.any(String),
      alias: 'myalias',
      expiresAt: undefined,
    });

    expect(result).toEqual(
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

  it('Переадресация на оригинальный URL', async () => {
    const mockUrl = {
      id: 1,
      shortUrl: 'abc123',
      originalUrl: 'https://example.com',
      clickCount: 0,
    };

    mockUrlRepository.findOne.mockResolvedValue(mockUrl);

    const result = await service.findByShortUrl('abc123');

    expect(mockUrlRepository.findOne).toHaveBeenCalledWith({ where: { shortUrl: 'abc123' } });
    expect(result).toEqual(mockUrl);
  });

  it('Должен отслеживать клик по короткой ссылке', async () => {
    const mockUrl = new Url();
    mockUrl.id = 1;
    mockUrl.shortUrl = 'abc123';
    mockUrl.originalUrl = 'https://example.com';
    mockUrl.clickCount = 0;
    mockUrl.createdAt = new Date();
    mockUrl.expiresAt = undefined;
    

    mockUrlRepository.save.mockResolvedValue(mockUrl);

    await service.trackClick(mockUrl, '127.0.0.1');

    expect(mockUrlRepository.save).toHaveBeenCalledWith(expect.objectContaining({ clickCount: 1 }));
    expect(mockClickAnalyticsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ ipAddress: '127.0.0.1' })
    );
    expect(mockClickAnalyticsRepository.save).toHaveBeenCalled();
  });
});
