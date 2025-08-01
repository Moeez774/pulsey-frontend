import LandingPage from '@/app/(_components)/_components/LandingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pulsey - Your AI Youtube Coach',
  description: 'Join Pulsey and grow fast in this modern era using high quality AI models.',
  icons: {
    icon: '/Images/main/Y__1_-removebg-preview.png',
  },
  verification: {
    google: 'K4hJrRxqe6oo7oictw5nc1v8hZfMA1PX4z_51pfJKE0',
  },
  keywords: [
    "YouTube analytics tool",
    "YouTube SEO",
    "AI YouTube insights",
    "YouTube video improvement",
    "retention analysis",
    "Pulsey",
    "content strategy",
    "metadata optimization",
    "video idea generator",
    "YouTube creator tools",
  ],
  openGraph: {
    title: "Pulsey – AI YouTube Analytics & Content Strategy Tool",
    description:
      "Fix pacing, retention, content gaps & get AI-suggested ideas. Free 14-day access for creators!",
    url: "https://pulsey-ai.vercel.app",
    siteName: "Pulsey",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulsey – AI YouTube Analytics Tool",
    description:
      "Fix your channel’s weak points with AI. Deep retention insights, transcript feedback & smart video ideas."
  },
};

export default function HomePage() {
  return <LandingPage />
} 