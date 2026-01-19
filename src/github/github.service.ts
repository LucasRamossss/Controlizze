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

  async getMe() {
    const res = await fetch('https://api.github.com/user', {
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
}
