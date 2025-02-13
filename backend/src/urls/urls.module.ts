import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { ClickAnalytics } from '../click-analytic/click-analytic.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Url, ClickAnalytics])],
  providers: [UrlsService],
  controllers: [UrlController]
})
export class UrlsModule {}
