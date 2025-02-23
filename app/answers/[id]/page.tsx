import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditableAnswers from "@/components/answer-editor";

interface AnswersPageProps {
  params: { id: string };
}

export default async function AnswersPage({ params }: AnswersPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  const formId = params.id;

  if (!userId) {
    return <p className="text-center mt-10">You should be authorized</p>;
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