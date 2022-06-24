import type { BoardEntry, MatchRequest, User } from "@prisma/client";
import { prisma } from "~/db.server";
import { getBoardEntry } from "~/models/board.server";

/**
 * "Get all match requests for a user."
 *
 * The function takes a single argument, an object with a single property, userId. The type of userId is User["id"], which
 * is a string
 * @param  - { userId: User["id"] }
 * @returns An array of MatchRequest objects
 */
export function getMatchRequestForUser({ userId }: { userId: User["id"] }) {
  return prisma.matchRequest.findMany({
    where: { toUserId: userId },
    select: {
      id: true,
      fromUser: true,
      status: true,
      createdAt: true,
      boardEntry: true,
    },
  });
}

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

/**
 * It deletes a match request from the database
 * @param  - Pick<BoardEntry, "id">
 * @returns A promise that resolves to the number of deleted rows.
 */
export async function deleteMatchRequest({ id }: Pick<BoardEntry, "id">) {
  return prisma.matchRequest.deleteMany({
    where: {
      id,
    },
  });
}

/**
 * It updates the status of a match request
 * @param  - Pick<MatchRequest, "id" | "status">
 * @returns A promise that resolves to the updated match request.
 */
export async function updateMatchRequestStatus({
  id,
  status,
}: Pick<MatchRequest, "id" | "status">) {
  return prisma.matchRequest.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}
