import { Controller, Get, Param, Query } from '@nestjs/common';
import { ControlizzeService } from './controlizze.service';

@Controller('controlizze')
export class ControlizzeController {
  constructor(private readonly controlizze: ControlizzeService) {}

  @Get('summary/:owner/:repo')
  summary(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('base') base?: string,
    @Query('head') head?: string,
  ) {
    if (!base || !head) {
      return { error: 'Missing query params. Use ?base=<sha>&head=<sha>' };
    }

    return this.controlizze.summary(owner, repo, base, head);
  }
}
