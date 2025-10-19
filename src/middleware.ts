import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configure which routes the middleware should run on.
// Adjust the matcher below to protect additional paths as needed.
export const config = {
  matcher: [
    '/admin/:path*',
    '/project-member/:path*',
    '/mentor/:path*',
    '/student/:path*',
    '/moderator/:path*',
    '/payment-gateway/:path*',
  ],
};



function hasAuth(req: NextRequest) {
  // Check for common token locations: cookie, Authorization header.
  const cookieToken = req.cookies.get('authToken')?.value || req.cookies.get('next-auth.session-token')?.value;
  const authHeader = req.headers.get('authorization');

  if (cookieToken) return true;
  if (authHeader && authHeader.startsWith('Bearer ')) return true;
  return false;
}

export function middleware(req: NextRequest) {
  // Allow public assets and API routes (they won't be matched by config but double-check)
  const pathname = req.nextUrl.pathname;

  // If authenticated, continue
  if (hasAuth(req)) return NextResponse.next();

  // If not authenticated, redirect to /unauthorized and include original path as `next` query
  const url = req.nextUrl.clone();
  url.pathname = '/unauthorized';
  url.searchParams.set('next', pathname + (req.nextUrl.search || ''));

  return NextResponse.redirect(url);
}
