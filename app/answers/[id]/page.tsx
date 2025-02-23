import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditableAnswers from "@/components/answer-editor";
import { JSX } from "react";

interface AnswersPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AnswersPage({
  params,
  searchParams,
}: AnswersPageProps): Promise<JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  const formId = params.id;

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