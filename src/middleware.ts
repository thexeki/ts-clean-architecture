import { type NextRequest, NextResponse } from "next/server";
import { checkAuthUseCase } from "@core/use-cases/auth.use-case";

export async function middleware(req: NextRequest) {
  let isAuth = false;

  try {
    const user = await checkAuthUseCase();
    isAuth = !!user;
  } catch (e) {}

  const isAuthRoute = req.nextUrl.pathname.startsWith("/sign-in");

  if (isAuth && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  unstable_allowDynamic: [
    "**/node_modules/reflect-metadata/**",
    "**/core/di/container.ts",
  ],
  matcher: ["/sign-in(.*)", "/sign-out(.*)"],
};
