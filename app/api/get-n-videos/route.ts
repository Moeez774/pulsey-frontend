import { google, youtube_v3, youtubeAnalytics_v2 } from 'googleapis';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const devMode = req.nextUrl.searchParams.get("dev") === "true";

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: token.accessToken as string,
  });

  const youtube: youtube_v3.Youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  const youtubeAnalytics: youtubeAnalytics_v2.Youtubeanalytics = google.youtubeAnalytics({
    version: 'v2',
    auth: oauth2Client,
  });

  try {
    const searchRes = await youtube.search.list({
      part: ['id'],
      forMine: true,
      type: ['video'],
      order: 'date',
      maxResults: 10,
    });

    const videoIds = searchRes.data.items
      ?.map(item => item.id?.videoId)
      .filter((id): id is string => Boolean(id));

    if (!videoIds || videoIds.length === 0) {
      return NextResponse.json({ error: 'No videos found' }, { status: 404 });
    }

    const metaRes = await youtube.videos.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      id: videoIds,
    });

    const metadata = metaRes.data.items || [];

    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    const startDate = lastMonth.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const analyticsResults = await Promise.all(
      (devMode ? videoIds.slice(0, 1) : videoIds).map(async (id) => {
        try {
          const analytics = await youtubeAnalytics.reports.query({
            ids: 'channel==MINE',
            startDate,
            endDate,
            filters: `video==${id}`,
            metrics: 'views,estimatedMinutesWatched,averageViewDuration,likes,subscribersGained',
            dimensions: 'day',
            sort: 'day',
          });

          return {
            videoId: id,
            analytics: analytics.data,
          };
        } catch (err: any) {
          console.warn(`Analytics failed for video ${id}:`, err.message);
          return {
            videoId: id,
            analytics: null,
            error: err.message,
          };
        }
      })
    );

    return NextResponse.json({
      devMode,
      videos: metadata.map((video) => {
        const analytics = analyticsResults.find((a) => a.videoId === video.id);
        return {
          metadata: video,
          analytics: analytics?.analytics || null,
          error: analytics?.error || null,
        };
      }),
    }, { status: 200 });

  } catch (err: any) {
    console.error("Failed to fetch YouTube data:", err);
    return NextResponse.json({ error: 'Failed to fetch data', detail: err.message }, { status: 500 });
  }
}
