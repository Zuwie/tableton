import type { BoardEntry, User } from "@prisma/client";
import { prisma } from "~/db.server";
import { getBoardEntry } from "~/models/board.server";

export async function createMatchRequest({
  id,
  userId,
}: Pick<BoardEntry, "id"> & { userId: User["id"] }) {
  const boardEntry = await getBoardEntry({ id });

  if (!boardEntry) throw new Error("BoardEntry could not be found");

  return prisma.matchRequest.create({
    data: {
      toUserId: boardEntry.id,
      fromUser: {
        connect: {
          id: userId,
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
