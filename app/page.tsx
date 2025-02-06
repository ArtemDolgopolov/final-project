import Link from "next/link";
import { auth } from "@/auth";
import { headers } from "next/headers";

export default async function HomePage() {
 const session = await auth.api.getSession({
  headers: await headers(),
})

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
      {session && (
        <Link
          href="/create-form"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Создать форму
        </Link>
      )}
    </main>
  );
}