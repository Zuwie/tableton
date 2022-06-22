import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import type { ExtendedProfile } from "@prisma/client";

export default function UserPopup({
  extendedProfile,
}: {
  extendedProfile: ExtendedProfile;
}) {
  console.log("extendedProfile", extendedProfile);
  return (
    <Popover>
      <PopoverTrigger>
        <Button>Open extended profile</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{extendedProfile.faction}</PopoverHeader>
        <PopoverBody>{extendedProfile.biography}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
