import React, { useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { BarChart3, Info } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '@/context/AuthProvider';
import AIResponse from '@/components/common/AIResponse';
import TypeWriter from '@/components/common/TypeWriter';

interface VideoAnalysisProps {
    isOpen: boolean;
    onClose: () => void;
    videoData: any;
    isLoading: boolean;
    isAnalyzing: boolean;
    error: string;
    transcriptData?: string;
    setIsAnalyzingVideo: (isAnalyzing: boolean) => void;
    videoUrl: string;
    setVideoUrl: (url: string) => void;
    setVideoData: (data: any) => void;
    setError: (error: string) => void;
    setTranscriptData: (data: string) => void;
    setIsOpen: (isOpen: boolean) => void;
}

const VideoAnalysis = ({ isOpen, onClose, videoData, isLoading, isAnalyzing, error, transcriptData, setIsAnalyzingVideo, videoUrl, setVideoUrl, setVideoData, setError, setTranscriptData, setIsOpen }: VideoAnalysisProps) => {
    const { data: session } = useSession();
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [open, setOpen] = useState(false)
    const [analysisData, setAnalysisData] = useState<any | null>(null)
    const { user } = useAuth()

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

    const formatVideoDataForAI = (videoData: any, transcriptData?: any): string => {
        const metadata = videoData.metadata;
        const analytics = videoData.analytics;

        let formattedText = `Video Title: ${metadata.snippet.title}\n`;
        formattedText += `Channel: ${metadata.snippet.channelTitle}\n`;
        formattedText += `Published: ${metadata.snippet.publishedAt}\n`;
        formattedText += `Duration: ${formatDuration(metadata.contentDetails.duration)}\n`;
        formattedText += `Quality: ${metadata.contentDetails.definition.toUpperCase()}\n\n`;

        formattedText += `Description:\n${metadata.snippet.description}\n\n`;

        formattedText += `${metadata.snippet.tags && metadata.snippet.tags.length > 0 ? `Tags:\n${metadata.snippet.tags.join(', ')}\n\n` : 'No tags available'}`;

        formattedText += `${metadata.statistics && metadata.statistics.viewCount ? `Statistics:\n` : 'No statistics available'}`;
        formattedText += `${metadata.statistics && metadata.statistics.viewCount ? `- Views: ${formatNumber(metadata.statistics.viewCount)}\n` : ''}`;
        formattedText += `${metadata.statistics && metadata.statistics.likeCount ? `- Likes: ${formatNumber(metadata.statistics.likeCount)}\n` : ''}`;
        formattedText += `${metadata.statistics && metadata.statistics.commentCount ? `- Comments: ${formatNumber(metadata.statistics.commentCount)}\n` : ''}`;
        formattedText += `${metadata.statistics && metadata.statistics.dislikeCount ? `- Dislikes: ${formatNumber(metadata.statistics.dislikeCount)}\n` : ''}`;
        formattedText += `${metadata.statistics && analytics?.rows?.reduce((total: number, row: any[]) => total + (row[5] || 0), 0) ? `- Total Subscribers Gained: ${formatNumber(analytics?.rows?.reduce((total: number, row: any[]) => total + (row[5] || 0), 0) || 0)}\n\n` : ''}`;

        if (analytics?.rows && analytics.rows.length > 0) {
            formattedText += `Performance Analytics (${analytics.rows.length} days):\n`;
            analytics.rows.forEach((row: any[], index: number) => {
                if (row[1] > 0 || row[4] > 0) {
                    formattedText += `Day ${index + 1} (${row[0]}): ${row[1]} views, ${row[4]} likes, ${row[2]} minutes watched, ${row[5]} subscribers gained\n`;
                }
            });
        }

        if (transcriptData) {
            formattedText += `\nTranscript:\n${transcriptData}\n\n`;
        }

        return formattedText;
    };

    const analyzeVideoWithAI = async () => {
        if (!videoData || !session?.accessToken) {
            toast.error('No video data available or not authenticated');
            return;
        }

        setIsOpen(false)
        setOpen(true)
        setIsAnalyzingVideo(true);
        try {
            const formattedVideoData = formatVideoDataForAI(videoData, transcriptData);
            console.log(formattedVideoData);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/analyze-video`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videoData: formattedVideoData,
                    user_id: user?._id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze video');
            }

            const result = await response.json();
            if (result.success) {
                toast.success('Video analyzed successfully!');
                setAnalysisData(result.data);
                setShowAnalysis(true);
            } else {
                toast.error(result.message || 'Analysis failed');
            }

        } catch (error: any) {
            console.error('Video analysis error:', error);
            toast.error(error.message || 'Failed to analyze video');
        } finally {
            setIsAnalyzingVideo(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen}
                onOpenChange={() => {
                    onClose()
                    setShowAnalysis(false)
                    setAnalysisData(null)
                    setIsAnalyzingVideo(false)
                    setError('')
                    setTranscriptData('')
                    setVideoData(null)
                    setVideoUrl('')
                    setVideoData(null)
                }}
            >
                <DialogContent className="h-[90vh] overflow-y-hidden sm:max-w-2xl flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BarChart3 size={20} className="text-[#9c3313]" />
                            {showAnalysis ? 'Video Analysis' : 'Video Analytics'}
                        </DialogTitle>
                        {videoData && <p className='text-xs text-[#7c6f6b] flex gap-1'><Info className='translate-y-[1px]' size={14} /> Based on YouTube API Data, Visualized by Pulsey</p>}
                        {videoData && analysisData && analysisData.video_analysis && (
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setShowAnalysis(false)}
                                    className={`px-3 py-1 cursor-pointer rounded text-sm font-medium transition-colors ${!showAnalysis
                                        ? 'bg-[#9c3313] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Analytics
                                </button>
                                <button
                                    onClick={() => setShowAnalysis(true)}
                                    className={`px-3 py-1 cursor-pointer rounded text-sm font-medium transition-colors ${showAnalysis
                                        ? 'bg-[#9c3313] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Analysis
                                </button>
                            </div>
                        )}
                    </DialogHeader>

                    <div className="flex-1 h-full flex flex-col justify-center items-center overflow-y-auto">
                        {isLoading ? (
                            <div className="flex h-full flex-col items-center justify-center py-20">
                                <div className="loader"></div>
                                <p className="text-[#7c6f6b] text-sm">Fetching video data...</p>
                            </div>
                        ) : isAnalyzing ? (
                            <div className="flex h-full flex-col items-center justify-center py-20">
                                <div className="loader"></div>
                                <p className="text-[#7c6f6b] text-sm">Analyzing video...</p>
                            </div>
                        ) : videoData ? (
                            <div className="space-y-6 h-full w-full">
                                {/* Video Info */}
                                <div className="bg-white rounded-lg p-6 border border-gray-200 w-full">
                                    <div className="flex flex-col gap-4">
                                        <img
                                            src={videoData.metadata.snippet.thumbnails.medium.url}
                                            alt={videoData.metadata.snippet.title}
                                            className="w-full h-[200px] object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[#231b1a] text-lg mb-2">
                                                {videoData.metadata.snippet.title}
                                            </h3>
                                            <p className="text-sm text-[#7c6f6b] mb-2">
                                                {videoData.metadata.snippet.channelTitle}
                                            </p>
                                            <p className="text-sm text-[#7c6f6b] mb-2 line-clamp-2">
                                                {videoData.metadata.snippet.description}
                                            </p>
                                            <div className="flex gap-4 text-xs text-[#7c6f6b]">
                                                <span>Published: {new Date(videoData.metadata.snippet.publishedAt).toLocaleDateString()}</span>
                                                <span>Duration: {formatDuration(videoData.metadata.contentDetails.duration)}</span>
                                                <span>Quality: {videoData.metadata.contentDetails.definition.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-[#9c3313]">
                                            {formatNumber(videoData.metadata.statistics.viewCount)}
                                        </div>
                                        <div className="text-xs text-[#7c6f6b]">Views</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-[#9c3313]">
                                            {formatNumber(videoData.metadata.statistics.likeCount)}
                                        </div>
                                        <div className="text-xs text-[#7c6f6b]">Likes</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-[#9c3313]">
                                            {formatNumber(videoData.metadata.statistics.commentCount)}
                                        </div>
                                        <div className="text-xs text-[#7c6f6b]">Comments</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-[#9c3313]">
                                            {formatNumber(videoData.metadata.statistics.dislikeCount)}
                                        </div>
                                        <div className="text-xs text-[#7c6f6b]">Dislikes</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-[#9c3313]">
                                            {formatNumber(videoData.analytics?.rows?.reduce((total: number, row: any[]) => total + (row[5] || 0), 0) || 0)}
                                        </div>
                                        <div className="text-xs text-[#7c6f6b]">Subscribers Gained</div>
                                    </div>
                                </div>

                                {/* Performance Analytics */}
                                {videoData.analytics?.rows && videoData.analytics.rows.length > 0 && (
                                    <div className="bg-white rounded-lg p-6 border border-gray-200 w-full">
                                        <h4 className="font-semibold text-[#231b1a] mb-4">
                                            Performance Analytics ({videoData.analytics.rows.length} days)
                                        </h4>
                                        <div className="w-full overflow-x-auto">
                                            <div className="min-w-[600px] w-full">
                                                <div className="grid grid-cols-5 gap-4 pb-3 border-b border-gray-200 text-xs font-medium text-[#7c6f6b]">
                                                    <div className="w-24">Date</div>
                                                    <div className="w-20 text-center">Views</div>
                                                    <div className="w-24 text-center">Min Watched</div>
                                                    <div className="w-16 text-center">Likes</div>
                                                    <div className="w-16 text-center">Subs</div>
                                                </div>

                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {videoData.analytics.rows.map((row: any[], index: number) => (
                                                        <div key={index} className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100 text-xs">
                                                            <div className="w-24 text-[#7c6f6b]">
                                                                {new Date(row[0]).toLocaleDateString()}
                                                            </div>
                                                            <div className="w-20 text-center font-medium">
                                                                {row[1]}
                                                            </div>
                                                            <div className="w-24 text-center">
                                                                {row[2]}
                                                            </div>
                                                            <div className="w-16 text-center">
                                                                {row[4]}
                                                            </div>
                                                            <div className="w-16 text-center">
                                                                {row[5]}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {videoData.metadata.snippet.tags && videoData.metadata.snippet.tags.length > 0 && (
                                    <div className="bg-white rounded-lg p-6 border border-gray-200 w-full">
                                        <h4 className="font-semibold text-[#231b1a] mb-3">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {videoData.metadata.snippet.tags.map((tag: string, index: number) => (
                                                <span key={index} className="bg-gray-100 text-[#7c6f6b] text-xs px-2 py-1 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {transcriptData && (
                                    <div className="bg-white rounded-lg p-6 border border-gray-200 w-full">
                                        <h4 className="font-semibold text-[#231b1a] mb-3">Transcript</h4>
                                        <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                            <p className="text-[15px] text-[#231b1a] leading-relaxed whitespace-pre-wrap">
                                                {transcriptData}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : !isLoading && !isAnalyzing && !videoData && !showAnalysis && !error ? (
                            <div className='text-center h-full flex flex-col items-center justify-center'>
                                <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                                    <FaSearch className='text-gray-400' size={32} />
                                </div>
                                <p className='text-lg font-medium text-[#231b1a] mb-2'>No video data available</p>
                                <p className='text-sm text-[#5b5b5b]'>Something went wrong on our end, Please wait while we fix it.</p>
                            </div>
                        ) : null}
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        {!isLoading && !isAnalyzing && videoData && !showAnalysis && (
                            <button
                                onClick={analyzeVideoWithAI}
                                disabled={isAnalyzing}
                                className="bg-[#9c3313] text-white px-6 py-2 rounded-lg hover:bg-[#d94010] transition-colors duration-200 cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MdAutoAwesome size={16} className="inline mr-2" />
                                {isAnalyzing ? 'Analyzing...' : 'Analyze with Pulsey'}
                            </button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AIResponse isOpen={open} ai_response={analysisData} setIsOpen={setOpen} showFeedback={!showAnalysis} heading='Video Analysis' content={
                <div className="h-full pt-6">
                    {isAnalyzing && <div className="flex h-screen w-full absolute top-0 left-0 flex-col items-center justify-center py-20">
                        <div className="loader"></div>
                        <p className="text-[#202020] mt-10 text-sm">Analyzing video...</p>
                        <p className="text-[#7c6f6b] text-xs mt-2">This may take some seconds</p>
                    </div>
                    }
                    {analysisData && showAnalysis && <div className="w-full h-full max-w-2xl mx-auto space-y-6 pb-4">
                        <TypeWriter speed={0.0001}>
                            <div className='p-6 flex flex-col gap-10 rounded-3xl shadow-md border'>
                                <div>
                                    <h1 className='text-center text-2xl font-bold'>✦ Pulsey's Analysis</h1>
                                    <p className='text-xs text-center text-[#7c6f6b] mt-2'><strong>Note:</strong> These insights are generated by Pulsey AI and are not official YouTube metrics.</p>
                                </div>

                                <div>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="font-semibold text-[#231b1a]">• Title Feedback:</span>
                                            <p className="text-sm text-[#5b5b5b] mt-1">{analysisData.video_analysis.title_feedback}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-[#231b1a]">• Description Feedback:</span>
                                            <p className="text-sm text-[#5b5b5b] mt-1">{analysisData.video_analysis.description_feedback}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-[#231b1a]">• Tag Analysis:</span>
                                            <p className="text-sm text-[#5b5b5b] mt-1">{analysisData.video_analysis.tag_analysis}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-[#231b1a]">• Hook Analysis:</span>
                                            <p className="text-sm text-[#5b5b5b] mt-1">{analysisData.video_analysis.hook_analysis}</p>
                                        </div>
                                    </div>
                                </div>


                                {/* Transcript Feedback */}
                                {analysisData.video_analysis.transcript_feedback && (
                                    <div>
                                        <h4 className="text-md font-semibold text-[#d94010] mb-2">Transcript Feedback</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <span className="font-semibold text-[#231b1a]">• Tone Analysis:</span>
                                                <p className="text-sm text-[#5b5b5b] mt-1">{analysisData.video_analysis.transcript_feedback.tone_analysis}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#231b1a]">• Message Clarity:</span>
                                                <p className="text-sm text-[#5b5b5b] mt-1">{analysisData.video_analysis.transcript_feedback.message_clarity}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#231b1a]">• Script Structure:</span>
                                                <p className="text-sm text-[#5b5b5b] mt-1">{analysisData.video_analysis.transcript_feedback.script_structure}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#231b1a]">• Language Style:</span>
                                                <p className="text-sm text-[#5b5b5b] mt-1">{analysisData.video_analysis.transcript_feedback.language_style}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-[#231b1a]">• Engagement Potential:</span>
                                                <p className="text-sm text-[#5b5b5b] mt-1">{analysisData.video_analysis.transcript_feedback.engagement_potential}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {/* Performance Summary */}
                                <div>
                                    <h4 className="text-md font-semibold text-[#231b1a] mb-2">• Performance Summary</h4>
                                    <p className="text-sm text-[#5b5b5b]">{analysisData.video_analysis.performance_summary}</p>
                                </div>


                                {/* Good Patterns */}
                                {analysisData.video_analysis.good_patterns && analysisData.video_analysis.good_patterns.length > 0 && (
                                    <div>
                                        <h4 className="text-md font-semibold text-green-700 mb-2">Good Patterns</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {analysisData.video_analysis.good_patterns.map((pattern: string, idx: number) => (
                                                <p key={idx} className="text-sm text-green-900">{`• ${pattern}`}</p>
                                            ))}
                                        </ul>
                                    </div>
                                )}


                                {/* Weaknesses */}
                                {analysisData.video_analysis.weaknesses && analysisData.video_analysis.weaknesses.length > 0 && (
                                    <div>
                                        <h4 className="text-md font-semibold text-red-700 mb-2">Weaknesses</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {analysisData.video_analysis.weaknesses.map((weak: string, idx: number) => (
                                                <p key={idx} className="text-sm text-red-900">{`• ${weak}`}</p>
                                            ))}
                                        </ul>
                                    </div>
                                )}


                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <h4 className="text-md font-semibold text-[#231b1a] mb-2">• Timing Insights</h4>
                                        <p className="text-sm text-[#5b5b5b]">{analysisData.video_analysis.timing_insights}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-md font-semibold text-[#231b1a] mb-2">• Audience Behavior</h4>
                                        <p className="text-sm text-[#5b5b5b]">{analysisData.video_analysis.audience_behavior}</p>
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col items-center justify-center">
                                        <h4 className="text-md font-semibold text-[#231b1a] mb-2">• Overall Rating</h4>
                                        <div className="text-xl text-center font-bold text-[#d94010]">{analysisData.video_analysis.overall_rating}</div>
                                    </div>


                                    <div className='mt-4'>
                                        <h4 className="text-md font-semibold text-[#231b1a] mb-2">• Next Video Suggestions</h4>
                                        <p className="text-sm text-[#5b5b5b]">{analysisData.video_analysis.next_video_suggestions}</p>
                                    </div>
                                </div>
                            </div>
                        </TypeWriter>
                    </div>}
                </div>
            } />

        </>
    );
};

export default VideoAnalysis; 