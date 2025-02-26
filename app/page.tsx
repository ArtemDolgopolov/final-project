import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const forms = await prisma.form.findMany({
    include: {
      user: true,
      responses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const popularForms = await prisma.form.findMany({
    include: {
      user: true,
    },
    orderBy: {
      responses: {
        _count: "desc",
      },
    },
    take: 5,
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl text-center font-bold">
        Welcome, {session ? session?.user?.name : "Guest"}
      </h1>

      {session && (
        <div className="mt-4 flex justify-center">
          <Link
            href="/create-form"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Create a form
          </Link>
        </div>
      )}

      <section className="mt-6">
        <h2 className="text-xl text-center font-semibold">Recent Forms</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => {
            let href = `/forms/${form.id}`;
            if (
              session &&
              session.user &&
              form.user.id === session.user.id &&
              form.responses.some((res) => res.userId === session.user.id)
            ) {
              href = `/answers/${form.id}`;
            }

            return (
              <Link key={form.id} href={href}>
                <div className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition">
                  <h2 className="text-lg font-bold">{form.title}</h2>
                  <p className="text-gray-600">{form.description}</p>
                  <p className="text-sm text-gray-500">
                    Created by {form.user.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl text-center font-semibold">Popular Forms</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularForms.map((form) => (
            <Link key={form.id} href={`/forms/${form.id}`}>
              <div className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition">
                <h2 className="text-lg font-bold">{form.title}</h2>
                <p className="text-gray-600">{form.description}</p>
                <p className="text-gray-600">Created by {form.user.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}