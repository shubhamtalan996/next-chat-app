import Button from "@/components/UI/Button";
import { db } from "@/lib/db";
import Dashboard from "@/app/(dashboard)/dashboard/page";

export default async function Home() {
  // await db.set("hello", "hello");
  return (
    <>
      <div>Hello Worldddooo!!</div>
      {/* <Dashboard /> */}
    </>
  );
}
