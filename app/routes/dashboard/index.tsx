import { NavLink, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getBoardEntryListItems } from "~/models/board.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  userBoardEntries: Awaited<ReturnType<typeof getBoardEntryListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const userBoardEntries = await getBoardEntryListItems({ userId });
  return json<LoaderData>({ userBoardEntries });
};

export default function DashboardIndexPage() {
  const loader = useLoaderData() as LoaderData;

  return (
    <div>
      <h1>This is the board</h1>
      {loader.userBoardEntries.length === 0 ? (
        <p className="p-4">No board-entries yet</p>
      ) : (
        <ol>
          {loader.userBoardEntries.map((entry) => (
            <li key={entry.id}>
              <NavLink
                to={entry.id}
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                }
              >
                {entry.title}
              </NavLink>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
