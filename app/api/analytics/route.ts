import { getToken } from "next-auth/jwt";
import { google } from "googleapis";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.accessToken) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: token.accessToken as string,
    });

    const youtubeAnalytics = google.youtubeAnalytics({
        version: "v2",
        auth: oauth2Client,
    });

    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const res = await youtubeAnalytics.reports.query({
            ids: "channel==MINE",
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            metrics: [
                "views",
                "estimatedMinutesWatched",
                "averageViewDuration",
                "averageViewPercentage",
                "subscribersGained",
                "subscribersLost",
                "likes",
                "dislikes",
                "shares",
                "comments"
            ].join(","),
            dimensions: "day",
        });


        return new Response(JSON.stringify(res.data), { status: 200 });
    } catch (err: any) {
        console.error('Analytics API error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
