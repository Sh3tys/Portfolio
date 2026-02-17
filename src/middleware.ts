import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Security Filter: Block suspicious paths targeting system folders
const BLOCKED_PATHS = [
  '/.env',
  '/.git',
  '/wp-admin',
  '/phpinfo',
  '/config.php',
];

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Path Filtering
    if (BLOCKED_PATHS.some(path => pathname.includes(path))) {
      return new NextResponse(null, { status: 403 });
    }

    // 2. Add Security Headers to all responses
    const response = NextResponse.next();
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Download-Options', 'noopen');
    return response;
  },
  {
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/dashboard/:path*", 
    "/admin/projects/:path*",
    "/:path*(.env|.git|wp-admin|phpinfo)"
  ],
};
