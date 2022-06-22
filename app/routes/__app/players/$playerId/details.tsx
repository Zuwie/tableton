import { getExtendedProfileForUser } from "~/models/user.server";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Avatar } from "@chakra-ui/react";
import invariant from "tiny-invariant";
import UserPopup from "~/components/UserPopup";
import UserPopupLoading from "~/components/UserPopupLoading";
import type { User } from "@prisma/client";

type LoaderData = {
  extendedProfile: Awaited<ReturnType<typeof getExtendedProfileForUser>>;
};

/**
 * It loads a player from the database and returns it as JSON
 * @param  - LoaderFunction - the type of the loader function.
 * @returns A function that takes an object with a playerId property and returns a promise that resolves to a player
 * object.
 */
export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.playerId, "playerId not found");

  const extendedProfile = await getExtendedProfileForUser({
    userId: params.playerId,
  });
  if (!extendedProfile) throw new Response("Not Found", { status: 404 });

  return json<LoaderData>({ extendedProfile });
};

export default function UserAvatar({ user }: { user: User }) {
  const loader = useFetcher();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (showDetails && loader.type === "init") {
      loader.load(`/players/${user.id}/details`);
    }
  }, [showDetails, user.id, loader]);

  return (
    <div
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <Avatar
        size="md"
        src={user.avatar || undefined}
        name={`${user.firstName} ${user.lastName}`}
      />
      {showDetails ? (
        loader.type === "done" ? (
          <UserPopup extendedProfile={loader.data.extendedProfile} />
        ) : (
          <UserPopupLoading />
        )
      ) : null}
    </div>
  );
}
