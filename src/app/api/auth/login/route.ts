import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  try {
    const backendRes = await axios.post(`${process.env.API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    const { accessToken, refreshToken, user } = backendRes.data;

    const accessTokenCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    });

    const refreshTokenCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    const response = NextResponse.json(user, { status: 200 });
    response.headers.append('Set-Cookie', accessTokenCookie);
    response.headers.append('Set-Cookie', refreshTokenCookie);

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || 'Login failed' },
      { status: error.response?.status || 500 }
    );
  }
}
