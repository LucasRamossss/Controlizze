import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { GithubModule } from './github/github.module';
import { ControlizzeModule } from './controlizze/controlizze.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GithubModule,
    ControlizzeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
