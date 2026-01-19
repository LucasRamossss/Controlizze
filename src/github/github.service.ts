import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(private readonly config: ConfigService) {}

  private get token(): string {
    const token = this.config.get<string>('GITHUB_TOKEN');
    if (!token) throw new Error('Missing GITHUB_TOKEN in environment');
    return token;
  }

  private async githubGet(url: string) {
    const res = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + this.token,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'controlizze-api',
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error('GitHub API error: ' + res.status + ' - ' + text);
    }

    return res.json();
  }

  async getMe() {
    return this.githubGet('https://api.github.com/user');
  }

  async listRepos(page = 1, perPage = 10) {
    const url =
      'https://api.github.com/user/repos?sort=updated&direction=desc' +
      '&page=' +
      page +
      '&per_page=' +
      perPage;

    return this.githubGet(url);
  }

  async listCommits(owner: string, repo: string, page = 1, perPage = 10) {
    const url =
      'https://api.github.com/repos/' +
      owner +
      '/' +
      repo +
      '/commits?page=' +
      page +
      '&per_page=' +
      perPage;

    return this.githubGet(url);
  }

  async compareCommits(owner: string, repo: string, base: string, head: string) {
    const url =
      'https://api.github.com/repos/' +
      owner +
      '/' +
      repo +
      '/compare/' +
      base +
      '...' +
      head;

    return this.githubGet(url);
  }
}
