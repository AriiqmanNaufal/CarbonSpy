import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const accessTokenCookie = serialize('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  const refreshTokenCookie = serialize('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
  response.headers.append('Set-Cookie', accessTokenCookie);
  response.headers.append('Set-Cookie', refreshTokenCookie);

  return response;
}
