import { Injectable } from '@nestjs/common';
import { GithubService } from '../github/github.service';

@Injectable()
export class ControlizzeService {
  constructor(private readonly github: GithubService) {}

  async summary(owner: string, repo: string, base: string, head: string) {
    const compare = await this.github.compareCommits(owner, repo, base, head);

    const files = Array.isArray(compare.files) ? compare.files : [];
    const commits = Array.isArray(compare.commits) ? compare.commits : [];

    let additionsTotal = 0;
    let deletionsTotal = 0;

    const normalizedFiles = files.map((f: any) => {
      const additions = Number(f.additions) || 0;
      const deletions = Number(f.deletions) || 0;
      const changes = Number(f.changes) || additions + deletions;

      additionsTotal += additions;
      deletionsTotal += deletions;

      return {
        filename: String(f.filename || ''),
        status: String(f.status || ''),
        additions,
        deletions,
        changes,
      };
    });

    const topFiles = [...normalizedFiles]
      .sort((a, b) => b.changes - a.changes)
      .slice(0, 5);

    const normalizedCommits = commits.map((c: any) => {
      const sha = String(c.sha || '');
      const message = String(c.commit?.message || '');
      const authorName = String(c.commit?.author?.name || '');
      const date = String(c.commit?.author?.date || '');

      return {
        sha: sha.slice(0, 7),
        message: message.split('\n')[0],
        author: authorName,
        date,
      };
    });

    return {
      repo: owner + '/' + repo,
      range: { base, head },
      totalCommits: Number(compare.total_commits) || normalizedCommits.length,
      filesChanged: normalizedFiles.length,
      additionsTotal,
      deletionsTotal,
      topFiles,
      commits: normalizedCommits,
    };
  }
}
