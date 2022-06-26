import { prisma } from "~/db.server";
import type { User } from "@prisma/client";

/**
 * It creates a new notification for the user with the given userId
 * @param  - userId: User["id"]
 * @returns A promise that resolves to a Notification object
 */
export async function createNotification({ userId }: { userId: User["id"] }) {
  return prisma.notification.create({
    data: {
      type: "MATCH_REQUEST_NEW",
      user: {
        connect: { id: userId },
      },
    },
  });
}

/**
 * It returns all notifications for a given user, ordered by creation date
 * @param  - The first parameter is the name of the query.
 * @returns An array of notifications
 */
export async function getNotificationForUser({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.notification.findMany({
    where: { userId },
    select: {
      id: true,
      type: true,
      createdAt: true,
      readAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * "Get all the unread notifications for a user."
 *
 * The function takes a single argument, an object with a single property, userId. The userId property is of type
 * User["id"], which is a string
 * @param  - {
 * @returns An array of objects with the id property.
 */
export async function getUnreadNotificationsForUser({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.notification.findMany({
    where: { userId, readAt: undefined },
    select: { id: true },
  });
}

/**
 * It updates all notifications for a given user to have a readAt date
 * @param  - readAt - The date that the notification was read
 * @returns The number of notifications that were updated.
 */
export async function setNotificationsToRead({
  readAt,
  userId,
}: {
  readAt: Date;
  userId: User["id"];
}) {
  return prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: readAt },
  });
}
