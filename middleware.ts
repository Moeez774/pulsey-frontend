import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const token = req.cookies.get('pulsey-auth-token')?.value;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/_next') || pathname === '/favicon.ico' || pathname.startsWith('/Images')) {
        return NextResponse.next()
    }

    if (!token) {
        if (pathname.startsWith('/auth') || pathname.startsWith('/reset-password') || pathname.startsWith('/api') || pathname.startsWith('/guide') || pathname === '/privacy-policy' || pathname === '/terms-of-services' || pathname === '/' || pathname === '/pricing') {
            return NextResponse.next();
        }
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    try {
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            if (!(pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/reset-password') || pathname.startsWith('/guide') || pathname === '/privacy-policy' || pathname === '/terms-of-services') || pathname === '/pricing') {
                url.pathname = '/';
                return NextResponse.redirect(url);
            }
            return NextResponse.next();
        }

        const secretKey = new TextEncoder().encode(secret);
        await jwtVerify(token, secretKey);

        if (pathname.startsWith('/auth') || pathname.startsWith('/reset-password') || (pathname === '/')) {
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    } catch (error) {
        console.error('JWT Verification Error:', error);

        if (!(pathname.startsWith('/') || pathname.startsWith('/auth') || pathname.startsWith('/reset-password'))) {
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/:path*']
};
