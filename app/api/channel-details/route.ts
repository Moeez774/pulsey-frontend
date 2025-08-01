import { google, youtube_v3 } from 'googleapis';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: token.accessToken as string,
  });

  const youtube: youtube_v3.Youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  try {
    const res = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings'],
      mine: true,
    });

    const channel = res.data.items?.[0];

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const channelDetails = {
      id: channel.id,
      name: channel.snippet?.title,
      description: channel.snippet?.description,
      profileImage: channel.snippet?.thumbnails?.high?.url,
      bannerImage: channel.brandingSettings?.image?.bannerExternalUrl,
      subscribers: channel.statistics?.subscriberCount,
      totalViews: channel.statistics?.viewCount,
      videoCount: channel.statistics?.videoCount,
    };

    return NextResponse.json(channelDetails, { status: 200 });

  } catch (err: any) {
    console.error("Failed to fetch channel data:", err);
    return NextResponse.json({ error: 'Failed to fetch channel info', detail: err.message }, { status: 500 });
  }
}
