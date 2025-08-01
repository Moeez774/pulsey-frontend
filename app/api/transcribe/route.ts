import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const YT_CAPTIONS_API = 'https://www.googleapis.com/youtube/v3/captions';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.accessToken)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const videoId = req.nextUrl.searchParams.get('videoId');
  if (!videoId)
    return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });

  try {
    const captionsRes = await fetch(`${YT_CAPTIONS_API}?part=snippet&videoId=${videoId}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!captionsRes.ok) {
      const error = await captionsRes.json();
      return NextResponse.json({ error: 'Failed to fetch caption metadata', detail: error }, { status: captionsRes.status });
    }

    const captionsData = await captionsRes.json();
    const captionList = captionsData.items;

    if (!captionList || captionList.length === 0) {
      return NextResponse.json({ error: 'No captions found for this video' }, { status: 404 });
    }

    const captionId = captionList[0].id;

    const downloadRes = await fetch(`${YT_CAPTIONS_API}/${captionId}?tfmt=srt`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!downloadRes.ok) {
      const error = await downloadRes.json();
      return NextResponse.json({ error: 'Failed to download caption', detail: error }, { status: downloadRes.status });
    }

    const captionText = await downloadRes.text();

    return NextResponse.json({
      metadata: captionsData,
      captionId,
      format: 'srt',
      text: captionText,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Something went wrong', detail: error.message }, { status: 500 });
  }
}
