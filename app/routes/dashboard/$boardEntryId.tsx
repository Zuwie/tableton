import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import type { BoardEntry } from "@prisma/client";
import { getBoardEntry } from "~/models/board.server";
import { ROUTES } from "~/constants";
import * as React from "react";

type LoaderData = {
  boardEntry: BoardEntry;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.boardEntryId, "boardEntryId not found");

  const boardEntry = await getBoardEntry({ userId, id: params.boardEntryId });
  if (!boardEntry) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ boardEntry });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.boardEntryId, "boardEntryId not found");

  await deleteNote({ userId, id: params.boardEntryId });

  return redirect("/dashboard");
};

export default function BoardEntryDetailsPage() {
  const data = useLoaderData() as LoaderData;
  return (
    <div>
      <Link to={ROUTES.DASHBOARD} className="button-primary mb-6 inline-block">
        Back to dashboard
      </Link>
      <h3 className="text-2xl font-bold">{data.boardEntry.title}</h3>
      <p className="py-6">{data.boardEntry.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>BoardEntry not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
