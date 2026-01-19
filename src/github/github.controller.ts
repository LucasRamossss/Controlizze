import { Controller, Get, Param, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly github: GithubService) {}

  @Get('me')
  me() {
    return this.github.getMe();
  }

  @Get('repos')
  repos(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const p = page ? Number(page) : 1;
    const pp = perPage ? Number(perPage) : 10;
    return this.github.listRepos(p, pp);
  }

  @Get('repos/:owner/:repo/commits')
  commits(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const p = page ? Number(page) : 1;
    const pp = perPage ? Number(perPage) : 10;
    return this.github.listCommits(owner, repo, p, pp);
  }
}
