import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    const userRole = token?.role || "buyer";

    if (pathname.startsWith("/dashboard/seller")) {
      if (userRole !== "seller" && userRole !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    if (pathname.startsWith("/dashboard/admin")) {
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (pathname.startsWith("/seller-application")) {
      if (userRole === "seller" || userRole === "admin") {
        return NextResponse.redirect(
          new URL("/dashboard/seller/profile", req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/seller/:path*",
    "/dashboard/buyer/:path*",
    "/seller-application/:path*",
    "/seller-application",
  ],
};
