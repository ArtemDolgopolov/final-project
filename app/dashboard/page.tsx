import { auth } from "@/auth";
import { headers } from "next/headers";
import Link from "next/link";
import prisma from "@/lib/prisma";

interface Form {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface Response {
  id: string;
  formId: string;
  answers: Record<string, string>;
  createdAt: string;
}

export default async function UserDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    return <p className="text-center mt-10">Вы должны быть авторизованы</p>;
  }

  const forms = await prisma.form.findMany({
    where: { userId },
    select: { id: true, title: true, description: true, createdAt: true },
  });

  const responses = await prisma.response.findMany({
    where: { userId },
    select: { id: true, formId: true, answers: true, createdAt: true },
  });

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-6 md:px-0">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Forms</h2>
          <div className="space-y-4">
            {forms.length > 0 ? (
              forms.map((form: Form) => (
                <div key={form.id} className="bg-white p-4 shadow-md rounded-md">
                  <h3 className="text-lg font-semibold">{form.title}</h3>
                  <p className="text-sm text-gray-600">{form.description}</p>
                  <Link href={`/forms/${form.id}`} className="text-blue-500 hover:underline">
                    Open
                  </Link>
                </div>
              ))
            ) : (
              <p>No saved answers yet.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Мои ответы</h2>
          <div className="space-y-4">
            {responses.length > 0 ? (
              responses.map((response: Response) => (
                <div key={response.id} className="bg-white p-4 shadow-md rounded-md">
                  <p className="text-sm text-gray-600">Ответ сохранен: {new Date(response.createdAt).toLocaleString()}</p>
                  <Link href={`/answers/${response.formId}`} className="text-blue-500 hover:underline">
                    Watch answers
                  </Link>
                </div>
              ))
            ) : (
              <p>You don't have saved answers.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}