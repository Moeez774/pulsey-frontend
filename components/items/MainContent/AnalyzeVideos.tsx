'use client'
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import { MdAutoAwesome } from 'react-icons/md';
import { useSuggestion } from '@/context/SuggestionProvider';
import { Play, BarChart3, Info, Eye, Calendar, ThumbsUp, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import Transcript, { extractYouTubeVideoId } from '@/components/components/Transcript/Transcript';
import VideoAnalysis from '@/components/components/Analysis/VideoAnalysis';
import ToolTip from '@/components/components/ToolTip';
import { ConnectYouTubeOverlay } from './MainContent';
import { useSearchParams } from 'next/navigation';
import OverallVideos from '@/components/components/Analysis/OverallVideos';

export const AnalyzeVideos = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams()
    const redirect = searchParams?.get("redirect") ? searchParams?.get("redirect") : ""
    const video_url = searchParams?.get("videoUrl") ? searchParams?.get("videoUrl") : ""
    const videoDescription = searchParams?.get("videoDescription") ? searchParams?.get("videoDescription") : ""
    const { videosData, isLoading } = useSuggestion();
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [statsDialogOpen, setStatsDialogOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [isHovering, setIsHovering] = useState<boolean[]>([]);
    const [videoAnalytics, setVideoAnalytics] = useState<any>(null);
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);
    const [error, setError] = useState('');
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [isAnalyzingVideo, setIsAnalyzingVideo] = useState(false);
    const [transcriptData, setTranscriptData] = useState('');
    const start_fetching = useRef(false)

    useEffect(() => {
        if (!videosData || !videosData.videos) return;
        setIsHovering((videosData as any).videos.map((video: any) => false));
    }, [videosData])

    const formatDuration = (duration: string) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) return '0:00';

        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '').replace('S', '');

        if (hours) {
            return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        }
        return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
    };

    const formatNumber = (num: string) => {
        const number = parseInt(num);
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toString();
    };

    const handleViewStats = (video: any) => {
        console.log('Opening stats for video:', video.metadata.id, video.metadata.snippet.title);
        console.log('Video analytics:', video.analytics);
        setSelectedVideo(video);
        setStatsDialogOpen(true);
    };

    const handleVideoSearch = async (video_url: string) => {
        if (!video_url.trim()) {
            toast.error('Please enter a video URL', { id: 'video-id' });
            return;
        }

        let videoId = video_url;
        if (video_url.startsWith("https://www.youtube.com/watch?v=")) {
            videoId = extractYouTubeVideoId(video_url) as string;
        }

        if (!videoId) {
            toast.error('Invalid YouTube video URL', { id: 'video-id' });
            return;
        }

        setVideoDialogOpen(true);
        setIsLoadingVideo(true);
        setError('');
        setVideoAnalytics(null);
        setTranscriptData('');

        try {
            const response = await fetch(`/api/video-analytics?videoId=${encodeURIComponent(videoId)}`, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken as string}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to fetch video analytics', { id: 'video-id' });
                return
            }

            const transResponse = await fetch(`/api/transcribe?videoId=${encodeURIComponent(videoId)}`, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken as string}`
                }
            });

            let transcriptText = '';
            if (transResponse.ok) {
                const transData = await transResponse.json();
                const lines = transData.text.split('\n');
                const textLines: string[] = [];

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line === '' || /^\d+$/.test(line) || /^\d{2}:\d{2}:\d{2},\d{3}\s-->\s\d{2}:\d{2}:\d{2},\d{3}$/.test(line)) {
                        continue;
                    }
                    if (line.length > 0) {
                        textLines.push(line);
                    }
                }
                transcriptText = textLines.join(' ');
            }

            const data = await response.json();
            setVideoAnalytics(data);
            setTranscriptData(transcriptText);
        } catch (err: any) {
            toast.error(err.message, { id: 'video-id' });
        } finally {
            setIsLoadingVideo(false);
        }
    };

    useEffect(() => {
        if (video_url && videoDescription && !start_fetching.current) {
            start_fetching.current = true
            handleVideoSearch(video_url)
        }
    }, [video_url, videoDescription, start_fetching])

    return (
        <section className="flex flex-col bg-[#f3f3f3] items-center w-full h-full lg:h-screen justify-start sm:p-2 relative">
            <div className="w-full max-w-7xl mx-auto bg-white h-full lg:overflow-y-auto sm:rounded-sm border-t sm:border md:p-8 px-6 py-8 relative" style={{ scrollbarWidth: 'thin' }}>
                <div className='flex xl:flex-row flex-col gap-4 justify-between xl:items-center'>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#231b1a] mb-1">Analyze Videos</h2>
                        <p className="text-[#7c6f6b]">Analyze your latest videos and get insights on how to improve them.</p>
                    </div>

                    <OverallVideos videosData={videosData} />
                </div>

                <div className='grid my-10 grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div className='h-auto min-h-60 w-full rounded-md p-6 flex flex-col justify-center bg-white shadow-sm border border-[#cfcfcf]'>
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-black mb-2">Analyze by Video URL</h3>
                            <p className="text-[#595959] text-sm">Get AI-powered insights for your any YouTube video</p>
                        </div>

                        <div className="space-y-4">
                            <Input
                                type="url"
                                placeholder="Paste YouTube video URL here..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="bg-transparent sm:text-base text-sm border-[#cfcfcf] text-black placeholder:text-black/60 focus:border-white focus:ring-white/20"
                            />

                            <button
                                onClick={() => handleVideoSearch(videoUrl)}
                                className='text-sm font-medium px-4 bg-[#9c3313] justify-center text-white rounded-sm py-[10px] hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 flex items-center w-full'
                            >
                                <MdAutoAwesome size={16} className="inline mr-2" />
                                Analyze
                            </button>
                        </div>
                    </div>

                    <Transcript />
                </div>

                <hr className='mb-8 max-w-2xl mx-auto border-[#f0f0f0]' />

                {isLoading ? (
                    <div className="flex items-center flex-col gap-10 justify-center py-20">
                        <div className="loader"></div>
                        <h1 className='font-medium text-[#231b1a]'>Loading videos...</h1>
                    </div>
                ) : videosData && (videosData as any)?.videos?.length > 0 ? (
                    <>
                        <h1 className='text-2xl font-bold text-[#231b1a] mb-4'>Latest Videos</h1>
                        <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(videosData as any).videos.map((video: any, index: number) => (
                                <div key={video.metadata.id} className="bg-white shadow-md h-fit md:h-[22em] w-full rounded-xl transition-all duration-200">
                                    <div className="flex w-full flex-col gap-1 h-full justify-between">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={video.metadata.snippet.thumbnails.medium.url}
                                                alt={video.metadata.snippet.title}
                                                className="w-full h-[180px] object-cover rounded-t-lg"
                                            />
                                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                                {formatDuration(video.metadata.contentDetails.duration)}
                                            </div>
                                        </div>

                                        <div className="flex-1 p-3 flex flex-col gap-2 min-w-0">
                                            <h3 className="font-semibold text-[#231b1a] text-sm line-clamp-2 mb-1">
                                                {video.metadata.snippet.title}
                                            </h3>
                                            <div className="flex flex-wrap justify-between items-center gap-4 text-xs text-[#595959]">
                                                <span className='flex items-center gap-1'><ThumbsUp size={14} /> {formatNumber(video.metadata.statistics.likeCount)}</span>
                                                <span className='flex items-center gap-1'><Eye size={14} /> {formatNumber(video.metadata.statistics.viewCount)}</span>
                                                <span className='flex items-center gap-1'><Calendar size={14} /> {new Date(video.metadata.snippet.publishedAt).toLocaleDateString()}</span>
                                                <span className='flex items-center gap-1'><MessageCircle size={14} /> {formatNumber(video.metadata.statistics.commentCount)}</span>
                                            </div>
                                        </div>

                                        <div className="flex p-4 gap-2 w-full mt-auto">
                                            <button
                                                onClick={() => handleViewStats(video)}
                                                 className='text-xs font-medium w-full px-4 justify-center rounded-sm border-[#cfcfcf] py-[7px] border shadow-sm hover:bg-[#f0f0f0] transition-all duration-200 flex items-center gap-2'
                                            >
                                                Statistics
                                            </button>
                                            <button
                                                onClick={() => handleVideoSearch(video.metadata.id)}
                                                className='text-xs font-medium px-4 w-full justify-center bg-[#9c3313] text-white rounded-sm py-[8px] hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 flex items-center gap-2'
                                            >
                                                Analyze
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <MdAutoAwesome className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-[#231b1a] mb-2">No videos found</h3>
                        <p className="text-sm text-[#7c6f6b]">Connect your YouTube channel to analyze your videos.</p>
                    </div>
                )}
            </div>

            {/* Video Stats Dialog */}
            <Dialog open={statsDialogOpen} onOpenChange={() => {
                setStatsDialogOpen(false)
                setSelectedVideo(null)
                setVideoAnalytics(null)
                setTranscriptData('')
                setIsLoadingVideo(false)
                setIsAnalyzingVideo(false)
                setError('')
                setVideoUrl('')
                setVideoDialogOpen(false)
            }}>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BarChart3 size={20} className="text-[#9c3313]" />
                            Video Statistics
                        </DialogTitle>
                        <p className='text-xs text-[#7c6f6b] flex gap-1'><Info className='translate-y-[1px]' size={14} /> Based on YouTube API Data, Visualized by Pulsey
                        </p>
                        <DialogDescription>
                            {selectedVideo?.metadata.snippet.title}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedVideo && (
                        <div className="space-y-6">

                            <div className="flex flex-col gap-4">
                                <img
                                    src={selectedVideo.metadata.snippet.thumbnails.medium.url}
                                    alt={selectedVideo.metadata.snippet.title}
                                    className="w-full h-[250px] object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-[#231b1a] mb-2">
                                        {selectedVideo.metadata.snippet.title}
                                    </h3>
                                    <p className="text-sm text-[#7c6f6b] mb-2">
                                        {selectedVideo.metadata.snippet.description}
                                    </p>
                                    <div className="flex gap-4 text-xs text-[#7c6f6b]">
                                        <span>Duration: {formatDuration(selectedVideo.metadata.contentDetails.duration)}</span>
                                        <span>Published: {new Date(selectedVideo.metadata.snippet.publishedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-[#9c3313]">
                                        {formatNumber(selectedVideo.metadata.statistics.viewCount)}
                                    </div>
                                    <div className="text-xs text-[#7c6f6b]">Views</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-[#9c3313]">
                                        {formatNumber(selectedVideo.metadata.statistics.likeCount)}
                                    </div>
                                    <div className="text-xs text-[#7c6f6b]">Likes</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-[#9c3313]">
                                        {formatNumber(selectedVideo.metadata.statistics.commentCount)}
                                    </div>
                                    <div className="text-xs text-[#7c6f6b]">Comments</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-[#9c3313]">
                                        {selectedVideo.metadata.contentDetails.definition.toUpperCase()}
                                    </div>
                                    <div className="text-xs text-[#7c6f6b]">Quality</div>
                                </div>
                            </div>

                            {/* Analytics Data */}
                            {selectedVideo.analytics?.rows && selectedVideo.analytics.rows.length > 0 ? (
                                <div>
                                    <h4 className="font-semibold text-[#231b1a] mb-3">
                                        Performance Over Time ({selectedVideo.analytics.rows.length} days)
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {selectedVideo.analytics.rows.map((row: any[], index: number) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-sm text-[#7c6f6b]">{row[0]}</span>
                                                <div className="flex gap-4 text-xs">
                                                    <span className="font-medium">{row[1]} views</span>
                                                    <span>{row[2]} min watched</span>
                                                    <span>{row[4]} likes</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-[#7c6f6b]">No analytics data available for this video</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <div className='absolute'>
                <VideoAnalysis
                    isOpen={videoDialogOpen}
                    videoUrl={videoUrl}
                    setVideoUrl={setVideoUrl}
                    setVideoData={setVideoAnalytics}
                    setError={setError}
                    setTranscriptData={setTranscriptData}
                    onClose={() => {
                        setVideoDialogOpen(false);
                        setVideoUrl('');
                        setError('');
                        setVideoAnalytics(null);
                        setIsLoadingVideo(false);
                        setIsAnalyzingVideo(false);
                        setTranscriptData('');
                        setSelectedVideo(null);
                    }}
                    videoData={videoAnalytics}
                    setIsOpen={setVideoDialogOpen}
                    isLoading={isLoadingVideo}
                    isAnalyzing={isAnalyzingVideo}
                    error={error}
                    setIsAnalyzingVideo={setIsAnalyzingVideo}
                    transcriptData={transcriptData}
                />
            </div>

            {!session && <ConnectYouTubeOverlay />}
        </section>
    )
}
