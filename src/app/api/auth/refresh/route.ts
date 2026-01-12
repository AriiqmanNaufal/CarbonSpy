import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body;

  try {
    const backendRes = await axios.post(`${process.env.API_BASE_URL}/auth/refresh`, { token });

    const { accessToken } = backendRes.data;

    const accessTokenCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    });

    const response = NextResponse.json({ accessToken }, { status: 200 });
    response.headers.append('Set-Cookie', accessTokenCookie);

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || 'Refresh failed' },
      { status: error.response?.status || 500 }
    );
  }
}
