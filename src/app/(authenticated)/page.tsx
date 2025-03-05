import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Home</h1>
      <h1>Email: {session.user.email}</h1>
      <h1>Name: {session.user.name}</h1>
      <h1>Role: {session.user.role}</h1>
    </div>
  );
}
