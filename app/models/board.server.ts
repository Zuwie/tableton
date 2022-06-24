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
      status: true,
      challenger: true,
    },
  });
}

/**
 * It returns a list of board entries, ordered by date, with only the id, title, gameSystem, location, date, and user
 * fields
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
      status: true,
    },
    orderBy: { date: "desc" },
  });
}

/**
 * "Get all the board entries for a user, ordered by date."
 *
 * The function takes a single argument, an object with a single property, userId. The userId property is of type
 * User["id"], which is a string
 * @param  - {
 * @returns An array of board entry objects
 */
export function getBoardEntryListItemsFromUser({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.boardEntry.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      gameSystem: true,
      location: true,
      date: true,
      user: true,
      status: true,
    },
    orderBy: { date: "desc" },
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
  status,
  userId,
}: Pick<
  BoardEntry,
  "body" | "title" | "gameSystem" | "location" | "date" | "status"
> & {
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
 * It updates a board entry with the given data
 * @param  - Pick<BoardEntry, "body" | "title" | "gameSystem" | "location" | "date" | "status">
 * @returns A BoardEntry
 */
export function updateBoardEntry({
  title,
  body,
  gameSystem,
  location,
  date,
  status,
  challengerId,
  id,
}: Partial<BoardEntry>) {
  return prisma.boardEntry.update({
    where: { id },
    data: {
      title: title || undefined,
      body: body || undefined,
      gameSystem: gameSystem || undefined,
      location: location || undefined,
      date: date || undefined,
      challengerId: challengerId || undefined,
      status: status || undefined,
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
