import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const { url } = body;

  try {
    const backendRes = await axios.post(`${process.env.API_BASE_URL}/scrape/start`,
    { url },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(backendRes.data, { status: 202 });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || 'Failed to start scan' },
      { status: error.response?.status || 500 }
    );
  }
}
