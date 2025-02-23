import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/auth";

const authRoutes = ["/sign-in", "/sign-up"];
const adminRoutes = ["/admin"];
const formCreatorRoutes = ["/create-form"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isAdminRoute = adminRoutes.includes(pathName);
  const isFormCreatorRoute = formCreatorRoutes.includes(pathName);

  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute) {
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isFormCreatorRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (session && pathName.startsWith("/forms/")) {
    const segments = pathName.split("/");
    if (segments.length === 3) {
      const formId = segments[2];
      try {
        const formResponse = await betterFetch<{ userId: string }>(`/api/forms/${formId}`, {
          baseURL: request.nextUrl.origin,
          headers: { cookie: request.headers.get("cookie") || "" },
        });
        if (formResponse.data && formResponse.data.userId === session.user.id) {
          return NextResponse.redirect(new URL(`/answers/${formId}`, request.url));
        }
      } catch (error) {}
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};