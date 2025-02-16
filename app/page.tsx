import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma  from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const forms = await prisma.form.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Welcome!</h1>

      {session && (
        <Link href="/create-form" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg">
          Create a form
        </Link>
      )}

      <div className="mt-6 space-y-4">
        {forms.map((form) => (
          <Link key={form.id} href={`/forms/${form.id}`} passHref>
            <div className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition">
              <h2 className="text-xl font-bold">{form.title}</h2>
              <p className="text-gray-600">{form.description}</p>
              <p className="text-sm text-gray-500">Created by {form.user.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}