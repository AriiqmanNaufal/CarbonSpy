import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password }_ = body;

  try {
    const backendRes = await axios.post(`${process.env.API_BASE_URL}/auth/register`, {
      email,
      password,
    });

    return NextResponse.json(backendRes.data, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || 'Registration failed' },
      { status: error.response?.status || 500 }
    );
  }
}
