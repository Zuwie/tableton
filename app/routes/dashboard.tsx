import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNoteListItems } from "~/models/note.server";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { Container } from "@chakra-ui/react";

type LoaderData = {
  noteListItems: Awaited<ReturnType<typeof getNoteListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json<LoaderData>({ noteListItems });
};

export default function BoardPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <>
      <Header />
      <Container maxW={"6xl"} minH={"100vh"}>
        <main className="h-full bg-white p-6">
          <div className="container mx-auto flex flex-col">
            <Link to="new" className="ml-auto block p-4 text-xl text-blue-500">
              + New Entry
            </Link>
            <Outlet />
          </div>
        </main>
      </Container>
      <Footer />
    </>
  );
}
