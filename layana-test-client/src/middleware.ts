import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const token = req.cookies.get('access_token')
    if (!token) {
        const url = new URL('/login', req.url)
        return NextResponse.redirect(url)
    }

    return res
}

export const config = {
    matcher: "/((?!login|_next/static|signup|_next/image).*)"
}