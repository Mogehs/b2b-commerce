export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    // Match all paths except for the ones starting with /api/auth
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
