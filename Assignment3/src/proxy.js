import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Role-based access control
    if (path.startsWith("/admin") && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    if (path.startsWith("/agent") && token?.role !== "Agent" && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    }
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/agent/:path*",
    "/api/leads/:path*",
    "/api/admin/:path*"
  ],
};
