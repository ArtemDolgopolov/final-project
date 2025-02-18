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
      responses: true, // Добавляем поле responses, чтобы проверять, ответил ли автор
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}!</h1>

      {session && (
        <Link
          href="/create-form"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Create a form
        </Link>
      )}

      <div className="mt-6 space-y-4">
        {forms.map((form) => {
          // Определяем, будет ли ссылка на форму или ответы
          let href = `/forms/${form.id}`;
          
          // Если пользователь — автор формы и уже ответил на неё
          if (
            session &&
            session.user &&
            form.user.id === session.user.id &&
            form.responses.some((res) => res.userId === session.user.id)
          ) {
            href = `/answers/${form.id}`;
          }

          return (
            <Link key={form.id} href={href} passHref>
              <div className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition">
                <h2 className="text-xl font-bold">{form.title}</h2>
                <p className="text-gray-600">{form.description}</p>
                <p className="text-sm text-gray-500">
                  Created by {form.user.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}