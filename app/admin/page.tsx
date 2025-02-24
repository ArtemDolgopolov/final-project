import UsersTable from "@/components/users-table";
import FormsTable from "@/components/forms-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export default async function Admin() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const forms = await prisma.form.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const formIds = forms.map(form => form.id);
  const responses = await prisma.response.findMany({
    where: { formId: { in: formIds } },
  });

  const formsWithResponses = forms.map(form => ({
    ...form,
    responses: responses.filter(response => response.formId === form.id),
  }));

  return (
    <main className="flex flex-col">
      <div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users and view system statistics
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable userId={userId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <FormsTable forms={formsWithResponses} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}