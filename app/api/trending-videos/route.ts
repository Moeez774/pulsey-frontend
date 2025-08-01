import { google } from 'googleapis';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || 'gaming';
  const maxResults = 5;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated', success: false }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: token.accessToken as string,
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const publishedAfter = sixMonthsAgo.toISOString();

  try {
    const searchRes = await youtube.search.list({
      part: ['snippet'],
      maxResults,
      q: query,
      type: ['video'],
      order: 'viewCount',
      publishedAfter,
    });

    const videoIds = searchRes.data.items
      ?.map(item => item.id?.videoId)
      .filter(Boolean) as string[];

    const videosRes = await youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: videoIds,
    });

    const videos = videosRes.data.items?.map(video => ({
      videoId: video.id,
      title: video.snippet?.title,
      description: video.snippet?.description,
      channelTitle: video.snippet?.channelTitle,
      publishTime: video.snippet?.publishedAt,
      tags: video.snippet?.tags || [],
      viewCount: video.statistics?.viewCount,
      likeCount: video.statistics?.likeCount,
    }));

    return NextResponse.json({ videos, success: true });
  } catch (error: any) {
    console.error('Error fetching recent trending videos:', error.message);
    return NextResponse.json({ error: 'Failed to fetch videos', success: false }, { status: 500 });
  }
}
