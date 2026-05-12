import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next-auth/next";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
    
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null;
    }

    if (!isAuth && req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'SUPER_ADMIN' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization in the middleware function itself
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/register'],
};
