import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/scan', '/billing', '/settings'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // If accessToken is missing but refreshToken is present, try to refresh
    if (!accessToken && refreshToken) {
      try {
        const response = await fetch(`${req.nextUrl.origin}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: refreshToken }),
        });

        if (response.ok) {
          const { accessToken: newAccessToken } = await response.json();
          const res = NextResponse.next();
          res.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 15,
            path: '/',
          });
          return res;
        } else {
          // If refresh fails, redirect to login
          return NextResponse.redirect(new URL('/login', req.url));
        }
      } catch (error) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  }

  // If user is logged in, redirect away from login/register pages
  if ((pathname === '/login' || pathname === '/register') && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/scan/:path*', '/billing/:path*', '/settings/:path*', '/login', '/register'],
};
