import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsModule } from './urls/urls.module';
import { ClickAnalyticModule } from './click-analytic/click-analytic.module';
import CONNECTION from './dbconnection';

@Module({
  imports: [
    //@ts-ignore
    TypeOrmModule.forRoot({
    ...CONNECTION,
    synchronize: false,
    autoLoadEntities: true,
  }),
    UrlsModule,
    ClickAnalyticModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
