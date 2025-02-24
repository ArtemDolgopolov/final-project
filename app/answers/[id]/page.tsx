import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditableAnswers from "@/components/answer-editor";

interface AnswersPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnswersPage({ params }: AnswersPageProps) {
  const resolvedParams = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  const formId = resolvedParams.id;

  if (!userId) {
    return <p className="text-center mt-10">You should be authorized</p>;
  }
  
  // проблема
  const responses = await prisma.response.findFirst({
    where: { userId, formId },
    include: { form: true },
  });

  if (!responses) {
    return notFound();
  }

  const questions = responses.form.questions as {
    id: string;
    title: string;
    label: string;
    type: string;
  }[];

  return (
   <EditableAnswers
     formId={formId}
     initialAnswers={
       responses.answers
       ? (responses.answers as Record<string, string>)
       : {}
     }
     questions={questions}
   />
  );
}