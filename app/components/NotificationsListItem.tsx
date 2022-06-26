import { ListItem, Stack, Text } from "@chakra-ui/react";
import { NOTIFICATIONS, ROUTES } from "~/constants";
import InternalLink from "~/components/InternalLink";
import * as timeAgo from "timeago.js";
import type { Notification } from "@prisma/client";

/**
 * It fetches notifications from the server and displays them in a list
 * @returns A list of notifications
 */
export default function NotificationsListItem({
  notificationListItems,
}: {
  notificationListItems: Pick<
    Notification,
    "id" | "type" | "createdAt" | "readAt"
  >[];
}) {
  return (
    <>
      {notificationListItems.map((notification) => (
        <ListItem key={notification.id}>
          <InternalLink
            to={
              notification.type === "MATCH_REQUEST_NEW"
                ? ROUTES.MATCH_REQUESTS
                : ROUTES.DASHBOARD
            }
            display="block"
            transition="0.2s"
            _hover={{ background: "gray.100" }}
          >
            <Stack spacing={2} p={4}>
              <Text>
                {NOTIFICATIONS[notification.type as keyof typeof NOTIFICATIONS]}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {timeAgo.format(notification.createdAt)}
              </Text>
            </Stack>
          </InternalLink>
        </ListItem>
      ))}
    </>
  );
}
