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
    where: { id, userId },
  });
}

export function getBoardEntryListItems({ userId }: { userId: User["id"] }) {
  return prisma.boardEntry.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createBoardEntry({
  body,
  title,
  userId,
}: Pick<BoardEntry, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.boardEntry.create({
    data: {
      title,
      body,
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
