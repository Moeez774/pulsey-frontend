import { google, youtube_v3, youtubeAnalytics_v2 } from 'googleapis';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const videoId = req.nextUrl.searchParams.get('videoId');
    if (!videoId) {
        return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.accessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: token.accessToken as string,
    });

    const youtube: youtube_v3.Youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const youtubeAnalytics: youtubeAnalytics_v2.Youtubeanalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });

    try {
        const metaRes = await youtube.videos.list({
            part: ['snippet', 'statistics', 'contentDetails'],
            id: [videoId],
        });

        const video = metaRes.data.items?.[0];

        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const analyticsRes = await youtubeAnalytics.reports.query({
            ids: 'channel==MINE',
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            filters: `video==${videoId}`,
            metrics: 'views,estimatedMinutesWatched,averageViewDuration,likes,subscribersGained',
            dimensions: 'day',
            sort: 'day',
        });

        return NextResponse.json({
            metadata: video,
            analytics: analyticsRes.data,
        }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to fetch data', detail: err.message }, { status: 500 });
    }
}