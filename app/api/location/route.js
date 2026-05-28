import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const x = searchParams.get('x');
  const y = searchParams.get('y');

  if (!x || !y) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`, {
      headers: {
        Authorization: `KakaoAK 05bbc382e05f3e1b7736121d17ebb4d1` // 서버에서만 호출되므로 안전하게 보관됨
      }
    });
    
    if (!response.ok) {
      throw new Error(`Kakao API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Server-side Kakao API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch location from Kakao' }, { status: 500 });
  }
}
