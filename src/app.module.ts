import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { GithubModule } from './github/github.module';
import { ControlizzeModule } from './controlizze/controlizze.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    GithubModule,
    ControlizzeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
