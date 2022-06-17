import type { BoardEntry, User } from "@prisma/client";
import { prisma } from "~/db.server";
import { getBoardEntry } from "~/models/board.server";

/**
 * It creates a match request from a user to a board entry
 * @param  - Pick<BoardEntry, "id"> & { userId: User["id"] }
 * @returns A match request
 */
export async function createMatchRequest({
  id,
  userId,
}: Pick<BoardEntry, "id"> & { userId: User["id"] }) {
  const boardEntry = await getBoardEntry({ id });
  if (!boardEntry) throw new Error("BoardEntry could not be found");

  return prisma.matchRequest.create({
    data: {
      fromUser: {
        connect: {
          id: userId,
        },
      },
      toUser: {
        connect: {
          id: boardEntry.user.id,
        },
      },
      boardEntry: {
        connect: {
          id: id,
        },
      },
    },
  });
}
