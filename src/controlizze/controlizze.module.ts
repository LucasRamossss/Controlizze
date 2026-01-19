import { Module } from '@nestjs/common';
import { GithubModule } from '../github/github.module';
import { ControlizzeController } from './controlizze.controller';
import { ControlizzeService } from './controlizze.service';

@Module({
  imports: [GithubModule],
  controllers: [ControlizzeController],
  providers: [ControlizzeService],
})
export class ControlizzeModule {}
