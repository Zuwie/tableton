import {
  Box,
  IconButton,
  List,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { LoaderDataNotifications } from "~/routes/notifications";
import { ROUTES } from "~/constants";
import NotificationsListItem from "~/components/NotificationsListItem";
import { useUser } from "~/utils";

export default function Notifications() {
  const fetcher = useFetcher<LoaderDataNotifications>();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { id } = useUser();

  useEffect(() => {
    if (fetcher.type === "done") {
      fetcher.submit(
        { readAt: new Date().toISOString(), userId: id },
        { action: ROUTES.NOTIFICATIONS, method: "post" }
      );
      fetcher.load(ROUTES.NOTIFICATIONS);
    }
  }, [isOpen]);

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(ROUTES.NOTIFICATIONS);
    }
    /* Checking if there are any notifications that have not been read yet. */
    setHasUnreadNotifications(
      !!fetcher.data?.notifications.some(
        (notification) => notification.readAt === null
      )
    );
  }, [fetcher]);

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          onClick={onToggle}
          size="lg"
          variant="ghost"
          aria-label="open menu"
          color={hasUnreadNotifications ? "red.500" : undefined}
          icon={<FiBell />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>Notifications</PopoverHeader>
        <PopoverBody p={0}>
          {fetcher.data?.notifications ? (
            <List>
              <NotificationsListItem
                notificationListItems={fetcher.data?.notifications}
              />
            </List>
          ) : (
            <Box px={2} py={3}>
              <Text>You have no notifications.</Text>
            </Box>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
