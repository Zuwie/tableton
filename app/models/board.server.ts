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

export function getBoardEntryListItems() {
  return prisma.boardEntry.findMany({
    select: {
      id: true,
      title: true,
      gameSystem: true,
      location: true,
      date: true,
      user: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function createBoardEntry({
  title,
  body,
  gameSystem,
  date,
  userId,
}: Pick<BoardEntry, "body" | "title" | "gameSystem" | "location" | "date"> & {
  userId: User["id"];
}) {
  return prisma.boardEntry.create({
    data: {
      title,
      body,
      gameSystem,
      location,
      date,
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
