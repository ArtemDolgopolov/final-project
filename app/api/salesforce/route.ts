import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { phone, company, jobTitle, firstName, lastName, email } = await req.json();

  const authResponse = await fetch("https://freelance-56e-dev-ed.develop.my.salesforce.com/services/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SALESFORCE_CLIENT_ID!,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
    }),
  });

  if (!authResponse.ok) {
    return NextResponse.json({ error: "Auth failed" }, { status: 401 });
  }

  const { access_token } = await authResponse.json();
  console.log(access_token);

  const accountResponse = await fetch(`${process.env.SALESFORCE_DOMAIN}/services/data/${process.env.SALESFORCE_API_VERSION}/sobjects/Account/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Name: company, Phone: phone }),
  });

  if (!accountResponse.ok) {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  const { id } = await accountResponse.json();
  console.log(id);

  const contactResponse = await fetch(`${process.env.SALESFORCE_DOMAIN}/services/data/${process.env.SALESFORCE_API_VERSION}/sobjects/Contact/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      AccountId: id, // Привязка к созданному Account
      Title: jobTitle,
    }),
  });

  if (!contactResponse.ok) {
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { salesforceRegistered: true },
  });

  return NextResponse.json({ message: "Account and Contact created successfully" });
}