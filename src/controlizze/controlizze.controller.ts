import { Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Post('snapshots/:owner/:repo')
  createSnapshot(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('base') base?: string,
    @Query('head') head?: string,
  ) {
    if (!base || !head) {
      return { error: 'Missing query params. Use ?base=<sha>&head=<sha>' };
    }
    return this.controlizze.createSnapshot(owner, repo, base, head);
  }

  @Get('snapshots/:owner/:repo')
  listSnapshots(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.controlizze.listSnapshots(owner, repo);
  }

  @Get('snapshots/:owner/:repo/:id')
  getSnapshot(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('id') id: string,
  ) {
    return this.controlizze.getSnapshot(owner, repo, id);
  }
}
