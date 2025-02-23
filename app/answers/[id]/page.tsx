import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditableAnswers from "@/components/answer-editor";
import { JSX } from "react";

interface AnswersPageProps {
  params: Record<string, string>;
}

export default async function AnswersPage({
  params,
}: AnswersPageProps): Promise<JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  const formId = params.id;

  if (!userId) {
    return <p className="text-center mt-10">Вы должны быть авторизованы</p>;
  }

  const response = await prisma.response.findFirst({
    where: { userId, formId },
    include: { form: true },
  });

  if (!response) {
    return notFound();
  }

  const questions = response.form.questions as {
    id: string;
    title: string;
    label: string;
    type: string;
  }[];

  return (
    <EditableAnswers
      formId={formId}
      initialAnswers={response.answers}
      questions={questions}
    />
  );
}