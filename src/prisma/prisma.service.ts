import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL || "file:./dev.db";
    const filePath = url.startsWith("file:") ? url.replace(/^file:/, "") : url;
    const resolvedPath = path.resolve(filePath);
    const adapter = new PrismaBetterSqlite3({ url: resolvedPath });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}