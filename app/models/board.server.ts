import type { BoardEntry, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { BoardEntry } from "@prisma/client";

/**
 * It returns a BoardEntry object with the id, title, body, gameSystem, location, date, and user fields
 * @param  - Pick<BoardEntry, "id"> & {
 * @returns BoardEntry
 */
export function getBoardEntry({ id }: Pick<BoardEntry, "id">) {
  return prisma.boardEntry.findFirst({
    where: { id },
    select: {
      id: true,
      title: true,
      body: true,
      gameSystem: true,
      location: true,
      date: true,
      user: true,
      matchRequests: true,
    },
  });
}

/**
 * "Get all board entries, ordered by the most recently updated."
 *
 * The function is defined as an async function, which means it returns a promise. The function uses the
 * prisma.boardEntry.findMany() method to get all board entries. The select property is used to specify which fields to
 * return. The orderBy property is used to specify how to order the results
 * @returns An array of objects with the following properties:
 *   id: true,
 *   title: true,
 *   gameSystem: true,
 *   location: true,
 *   date: true,
 *   user: true,
 */
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

/**
 * It creates a new board entry in the database
 * @param  - Pick<BoardEntry, "body" | "title" | "gameSystem" | "location" | "date">
 * @returns A BoardEntry
 */
export function createBoardEntry({
  title,
  body,
  gameSystem,
  location,
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

/**
 * It deletes a board entry
 * @param  - Pick<BoardEntry, "id"> & { userId: User["id"] }
 * @returns A promise that resolves to the number of deleted entries.
 */
export function deleteBoardEntry({
  id,
  userId,
}: Pick<BoardEntry, "id"> & { userId: User["id"] }) {
  return prisma.boardEntry.deleteMany({
    where: { id, userId },
  });
}
