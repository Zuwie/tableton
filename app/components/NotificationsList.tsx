import { useFetcher } from "@remix-run/react";
import type { LoaderDataNotifications } from "~/routes/notifications";
import { useEffect } from "react";
import { List, ListItem, Stack, Text } from "@chakra-ui/react";
import { NOTIFICATIONS, ROUTES } from "~/constants";
import InternalLink from "~/components/InternalLink";
import * as timeAgo from "timeago.js";

/**
 * It fetches notifications from the server and displays them in a list
 * @returns A list of notifications
 */
export default function NotificationsList() {
  const fetcher = useFetcher<LoaderDataNotifications>();

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(ROUTES.NOTIFICATIONS);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action={ROUTES.NOTIFICATIONS}>
      <List>
        {fetcher.data?.notifications.map((notification) => (
          <ListItem key={notification.id}>
            <InternalLink
              to={
                notification.type === "MATCH_REQUEST_NEW"
                  ? ROUTES.MATCH_REQUESTS
                  : ROUTES.DASHBOARD
              }
              display="block"
              transition="0.2s"
              _hover={{ background: "teal.500", color: "white" }}
            >
              <Stack spacing={4} p={4}>
                <Text>
                  {
                    NOTIFICATIONS[
                      notification.type as keyof typeof NOTIFICATIONS
                    ]
                  }
                </Text>
                <Text fontSize="xs">
                  {timeAgo.format(notification.createdAt)}
                </Text>
              </Stack>
            </InternalLink>
          </ListItem>
        ))}
      </List>
    </fetcher.Form>
  );
}
