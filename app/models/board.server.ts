import type { BoardEntry, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { BoardEntry } from "@prisma/client";

export function getBoardEntry({
  id,
  userId,
}: Pick<BoardEntry, "id"> & {
  userId: User["id"];
}) {
  return prisma.boardEntry.findFirst({
    where: { id },
  });
}

export function getBoardEntryListItems({ userId }: { userId: User["id"] }) {
  return prisma.boardEntry.findMany({
    // where: { userId },
    select: { id: true, title: true, gameSystem: true, user: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createBoardEntry({
  title,
  body,
  gameSystem,
  userId,
}: Pick<BoardEntry, "body" | "title" | "gameSystem"> & {
  userId: User["id"];
}) {
  return prisma.boardEntry.create({
    data: {
      title,
      body,
      gameSystem,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteBoardEntry({
  id,
  userId,
}: Pick<BoardEntry, "id"> & { userId: User["id"] }) {
  return prisma.boardEntry.deleteMany({
    where: { id, userId },
  });
}
