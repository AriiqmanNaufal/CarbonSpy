import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { jobId } = params;

  try {
    const backendRes = await axios.get(`${process.env.API_BASE_URL}/scrape/status/${jobId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(backendRes.data, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || 'Failed to fetch job status' },
      { status: error.response?.status || 500 }
    );
  }
}
