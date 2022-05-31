import { useOptionalUser } from "~/utils";
import Header from "~/components/Header";

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <Header />
      <main className="min-h-screen"></main>
    </>
  );
}
