-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "head" TEXT NOT NULL,
    "totalCommits" INTEGER NOT NULL,
    "filesChanged" INTEGER NOT NULL,
    "additionsTotal" INTEGER NOT NULL,
    "deletionsTotal" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SnapshotFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "snapshotId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "additions" INTEGER NOT NULL,
    "deletions" INTEGER NOT NULL,
    "changes" INTEGER NOT NULL,
    CONSTRAINT "SnapshotFile_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SnapshotFile_snapshotId_idx" ON "SnapshotFile"("snapshotId");
