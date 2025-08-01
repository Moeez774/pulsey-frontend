'use client'
import { useAuth } from '@/context/AuthProvider'
import React, { useEffect, useRef, useState } from 'react'
import { MdAutoAwesome } from 'react-icons/md'
import { toast } from 'sonner'
import AIResponse from '@/components/common/AIResponse';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { AlertCircle, ArrowRight, FileWarning, LayoutTemplate, Paintbrush, ShieldCheck, Star, TrendingUp } from 'lucide-react'

const AnalysisAccordion = ({ analysisData, heading }: { analysisData: any, heading: any }) => {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className='cursor-pointer'>{heading}</AccordionTrigger>
                <AccordionContent>
                    {analysisData}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

interface Details {
    videosData: any
}

const OverallVideos: React.FC<Details> = ({ videosData }) => {
    const { user } = useAuth()
    const [trendingVideos, setTrendingVideos] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [analysisData, setAnalysisData] = useState<any>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isDeepAnalysis, setIsDeepAnalysis] = useState(false)
    const hasFetchedTrendingVideos = useRef(false)
    const [hasFetchedAnalysis, setHasFetchedAnalysis] = useState(false)

    const formatNumber = (num: string) => {
        const number = parseInt(num);
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toString();
    };

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

    const formatVideosDataForAI = (trendingVideos: any[], userVideos: any): string => {
        let formattedText = `=== TRENDING VIDEOS ANALYSIS ===\n`;
        formattedText += `Top 5 trending videos from user's niche (${user.niche[0]}):\n\n`;

        trendingVideos.forEach((video, index) => {
            formattedText += `${index + 1}. Trending Video:\n`;
            formattedText += `   Title: ${video.title}\n`;
            formattedText += `   Channel: ${video.channelTitle}\n`;
            formattedText += `   Video ID: ${video.videoId}\n`;
            formattedText += `   Published: ${new Date(video.publishTime).toLocaleDateString()}\n`;
            formattedText += `   Views: ${formatNumber(video.viewCount)}\n`;
            formattedText += `   Likes: ${formatNumber(video.likeCount)}\n`;
            formattedText += `   Description: ${video.description || 'No description'}\n`;
            formattedText += `   Tags: ${video.tags && video.tags.length > 0 ? video.tags.join(', ') : 'No tags'}\n\n`;
        });

        formattedText += `=== USER'S VIDEOS ANALYSIS ===\n`;
        formattedText += `User's latest videos:\n\n`;

        userVideos.videos.forEach((video: any, index: number) => {
            const metadata = video.metadata;
            formattedText += `${index + 1}. User Video:\n`;
            formattedText += `   Title: ${metadata.snippet.title}\n`;
            formattedText += `   Channel: ${metadata.snippet.channelTitle}\n`;
            formattedText += `   Video ID: ${metadata.id}\n`;
            formattedText += `   Published: ${new Date(metadata.snippet.publishedAt).toLocaleDateString()}\n`;
            formattedText += `   Duration: ${formatDuration(metadata.contentDetails.duration)}\n`;
            formattedText += `   Quality: ${metadata.contentDetails.definition.toUpperCase()}\n`;
            formattedText += `   Views: ${formatNumber(metadata.statistics.viewCount)}\n`;
            formattedText += `   Likes: ${formatNumber(metadata.statistics.likeCount)}\n`;
            formattedText += `   Comments: ${formatNumber(metadata.statistics.commentCount)}\n`;
            formattedText += `   Dislikes: ${formatNumber(metadata.statistics.dislikeCount)}\n`;
            formattedText += `   Description: ${metadata.snippet.description}\n`;
            formattedText += `   Tags: ${metadata.snippet.tags && metadata.snippet.tags.length > 0 ? metadata.snippet.tags.join(', ') : 'No tags'}\n`;

            if (video.analytics && video.analytics.rows && video.analytics.rows.length > 0) {
                formattedText += `   Performance Analytics (${video.analytics.rows.length} days):\n`;
                video.analytics.rows.forEach((row: any[], dayIndex: number) => {
                    if (row[1] > 0 || row[4] > 0) {
                        formattedText += `     Day ${dayIndex + 1} (${row[0]}): ${row[1]} views, ${row[4]} likes, ${row[2]} minutes watched, ${row[5]} subscribers gained\n`;
                    }
                });
            } else {
                formattedText += `   Performance Analytics: No analytics data available\n`;
            }

            formattedText += `\n`;
        });

        return formattedText;
    };

    const analyzeOverallVideos = async (deepAnalysis: boolean = false) => {
        if (trendingVideos.length === 0 || videosData.videos.length === 0) {
            toast.error('No video data available for analysis');
            return;
        }

        setIsOpen(true);
        setIsLoading(true)
        setIsCompleted(false)

        try {
            const formattedData = formatVideosDataForAI(trendingVideos, videosData);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/analyze-overall-videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videosData: formattedData,
                    user_id: user?._id,
                    keyword: user?.niche[0],
                    deep_analysis: deepAnalysis
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze videos');
            }

            const result = await response.json();
            if (result.success) {
                toast.success('Overall analysis completed!');
                setIsCompleted(true);
                if (typeof result.data === 'string') {
                    const parsedData = JSON.parse(result.data);
                    setAnalysisData(parsedData);
                } else {
                    setAnalysisData(result.data);
                }

                setTimeout(() => {
                    setHasFetchedAnalysis(true)
                }, 100)
            } else {
                if (result.limit_exceeded) {
                    setIsOpen(false);
                    setIsLoading(false);
                    setIsCompleted(false);
                    setIsDeepAnalysis(false);
                    setAnalysisData(null);
                }
                toast.error(result.message || 'Analysis failed');
            }

        } catch (error: any) {
            console.error('Overall analysis error:', error);
            toast.error(error.message || 'Failed to analyze videos');
        } finally {
            setIsLoading(false);
        }
    };

    const getTrendingVideos = async () => {
        setIsLoading(true)
        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/videos/get-trending-videos?keyword=${user.niche[0]}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const videos = await response.json()

            if (videos.success) {
                setTrendingVideos(videos.videos)
                return
            }
            else {
                const res = await fetch(`/api/trending-videos?q=${user.niche[0].toLowerCase()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.accessToken}`
                    },
                })

                const data = await res.json()

                if (data.success) {
                    setTrendingVideos(data.videos)

                    // saving in DB for 7 days
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/videos/save-trending-videos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ videos: data.videos, keyword: user.niche[0], user_id: user._id })
                    })

                    const videos = await response.json()

                    if (!videos.success) {
                        console.error(videos.message)
                    }
                }
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong", { id: 'trending-videos' })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!hasFetchedTrendingVideos.current && user && user.niche.length > 0) {
            hasFetchedTrendingVideos.current = true
            getTrendingVideos()
        }
    }, [user])

    return (
        <>
            <div className='w-full sm:w-fit'>
                <button
                    className='text-[13px] font-medium px-4 bg-[#9c3313] justify-center text-white rounded-sm py-[10px] hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 flex items-center w-full gap-2'
                    onClick={() => analyzeOverallVideos(false)}
                    disabled={isLoading}
                >
                    <MdAutoAwesome size={16} /> Analyze Overall
                </button>
            </div>

            <div className='absolute'>
                <AIResponse
                    heading='Overall Videos Analysis'
                    showFeedback={isLoading}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    ai_response={analysisData}
                    content={
                        <div className='flex text-start justify-start items-start'>
                            {isLoading && (
                                <div className='flex absolute w-full h-screen top-0 left-0 flex-col items-center justify-start'>
                                    <div className="loader"></div>
                                    <div className='-translate-y-10'>
                                        <p className='text-sm text-[#202020] text-center font-medium'>
                                            {isDeepAnalysis ? "Running deep analysis..." : "Analyzing your all videos..."}
                                        </p>
                                        <p className='text-xs text-[#7c6f6b] mt-1.5 text-center font-medium'>
                                            {isDeepAnalysis ? "This may take 40s to 60s" : "This may take some seconds"}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {!isLoading && analysisData && (
                                <div className='flex flex-col gap-3 w-full'>
                                    <div className={`flex flex-col text-sm gap-2 shadow-md border rounded-3xl p-6 w-full text-start mt-6 ${hasFetchedAnalysis ? 'translate-y-0 opacity-[1]' : 'translate-y-6 opacity-0'} transition-all duration-500`}>
                                        <div>
                                            <h1 className='text-center text-2xl mb-6 font-bold'>✦ Pulsey's Analysis</h1>
                                            <p className='text-xs text-center text-[#7c6f6b] mt-1'><strong>Note:</strong> These insights are generated by Pulsey AI and are not official YouTube metrics.</p>
                                        </div>

                                        {analysisData.content_issues && analysisData.content_issues.length > 0 && (

                                            <AnalysisAccordion analysisData={
                                                <div>
                                                    {analysisData.content_issues.map((issue: any, index: number) => (
                                                        <div key={index} className="mb-4">
                                                            {issue.video_thumbnail && <img src={issue.video_thumbnail} alt="" className='w-full h-40 object-cover rounded-lg mb-4' />}
                                                            <h4 className="mb-2 font-medium"><strong>Title:</strong> {issue.video_title}</h4>
                                                            <p className="mb-2 text-sm"><strong>• Problem:</strong> {issue.problem}</p>
                                                            <p className="mb-2 text-sm"><strong>• Impact:</strong> {issue.impact}</p>
                                                            <p className="mb-2 text-sm"><strong>• Based on:</strong> {issue.based_on}</p>
                                                            <p className="text-sm"><strong>• Suggestion:</strong> {issue.suggestion} <span className='text-xs text-[#7c6f6b]'>{issue.actionable_tip}</span></p>

                                                            {index !== analysisData.content_issues.length - 1 && <hr className='w-40 my-6 mx-auto' />}
                                                        </div>
                                                    ))}

                                                </div>
                                            } heading={
                                                <div className='flex items-center gap-2 text-start'>
                                                    <div className='p-1.5 rounded-md bg-[#f0f0f0]'><AlertCircle size={20} /></div>
                                                    <h1 className='text-base font-semibold'>Content issues</h1>
                                                </div>
                                            } />

                                        )}

                                        <hr />

                                        {/* Metadata Issues */}
                                        {analysisData.metadata_issues && analysisData.metadata_issues.length > 0 && (
                                            <AnalysisAccordion analysisData={
                                                <div>
                                                    {analysisData.metadata_issues.map((issue: any, index: number) => (
                                                        <div key={index} className="mb-4">
                                                            {issue.video_thumbnail && <img src={issue.video_thumbnail} alt="" className='w-full h-40 object-cover rounded-lg mb-4' />}
                                                            <h4 className="mb-2 font-medium"><strong>Title:</strong> {issue.video_title} - {issue.field}</h4>
                                                            <p className="mb-2 text-sm"><strong>• Problem:</strong> {issue.problem}</p>
                                                            <p className="mb-2 text-sm"><strong>• Impact:</strong> {issue.impact}</p>
                                                            <p className="mb-2 text-sm"><strong>• Based on:</strong> {issue.based_on}</p>
                                                            <p className="text-sm"><strong>• Suggestion:</strong> {issue.suggestion}</p>

                                                            {index !== analysisData.metadata_issues.length - 1 && <hr className='w-40 my-6 mx-auto' />}
                                                        </div>
                                                    ))}
                                                </div>
                                            } heading={
                                                <div className='flex items-center gap-2 text-start'>
                                                    <div className='p-1.5 rounded-md bg-[#f0f0f0]'><FileWarning size={20} /></div>
                                                    <h1 className='text-base font-semibold'>Metadata issues</h1>
                                                </div>
                                            } />

                                        )}

                                        <hr />

                                        {/* Structural Analysis */}
                                        {analysisData.structural_analysis && analysisData.structural_analysis.length > 0 && (
                                            <AnalysisAccordion analysisData={
                                                <div>
                                                    {analysisData.structural_analysis.map((item: any, index: number) => (
                                                        <div key={index} className="mb-4">
                                                            {item.video_thumbnail && <img src={item.video_thumbnail} alt="" className='w-full h-40 object-cover rounded-lg mb-4' />}
                                                            <h4 className="mb-2 font-medium"><strong>Title:</strong> {item.video_title} - {item.timestamp}</h4>
                                                            <p className="mb-2 text-sm"><strong>• Issue:</strong> {item.issue}</p>
                                                            <p className="mb-2 text-sm"><strong>• Impact:</strong> {item.impact}</p>
                                                            <p className="mb-2 text-sm"><strong>• Based on:</strong> {item.based_on}</p>
                                                            <p className="text-sm"><strong>• Suggestion:</strong> {item.suggestion}</p>

                                                            {index !== analysisData.structural_analysis.length - 1 && <hr className='w-40 my-6 mx-auto' />}
                                                        </div>
                                                    ))}
                                                </div>
                                            } heading={
                                                <div className='flex items-center gap-2 text-start'>
                                                    <div className='p-1.5 rounded-md bg-[#f0f0f0]'><LayoutTemplate size={20} /></div>
                                                    <h1 className='text-base font-semibold'>Structural analysis</h1>
                                                </div>
                                            } />

                                        )}

                                        <hr />

                                        {/* Style Gaps */}
                                        {analysisData.style_gaps && analysisData.style_gaps.length > 0 && (
                                            <AnalysisAccordion analysisData={
                                                <div>
                                                    {analysisData.style_gaps.map((gap: any, index: number) => (
                                                        <div key={index} className="mb-4">
                                                            {gap.video_thumbnail && <img src={gap.video_thumbnail} alt="" className='w-full h-40 object-cover rounded-lg mb-4' />}
                                                            <h4 className="mb-2 font-medium"><strong>Title:</strong> {gap.video_title}</h4>
                                                            <p className="mb-2 text-sm"><strong>• Gap:</strong> {gap.gap}</p>
                                                            <p className="mb-2 text-sm"><strong>• Effect:</strong> {gap.effect}</p>
                                                            <p className="mb-2 text-sm"><strong>• Compared to:</strong> {gap.compared_to}</p>
                                                            <p className="text-sm"><strong>• Improvement tip:</strong> {gap.improvement_tip}</p>

                                                            {index !== analysisData.structural_analysis.length - 1 && <hr className='w-40 my-6 mx-auto' />}
                                                        </div>
                                                    ))}
                                                </div>
                                            } heading={
                                                <div className='flex items-center gap-2 text-start'>
                                                    <div className='p-1.5 rounded-md bg-[#f0f0f0]'><Paintbrush size={20} /></div>
                                                    <h1 className='text-base font-semibold'>Style gaps</h1>
                                                </div>
                                            } />

                                        )}

                                        <hr />

                                        {/* Strengths to Keep */}
                                        {analysisData.strengths_to_keep && analysisData.strengths_to_keep.length > 0 && (
                                            <AnalysisAccordion analysisData={
                                                <div>
                                                    {analysisData.strengths_to_keep.map((strength: any, index: number) => (
                                                        <div key={index} className="mb-4">
                                                            {strength.video_thumbnail && <img src={strength.video_thumbnail} alt="" className='w-full h-40 object-cover rounded-lg mb-4' />}
                                                            <h4 className="mb-2 font-medium"><strong>Title:</strong> {strength.video_title}</h4>
                                                            <p className="mb-2 text-sm"><strong>• Strength:</strong> {strength.strength}</p>
                                                            <p className="text-sm"><strong>• Why it works:</strong> {strength.why_it_works}</p>

                                                            {index !== analysisData.strengths_to_keep.length - 1 && <hr className='w-40 my-6 mx-auto' />}
                                                        </div>
                                                    ))}
                                                </div>
                                            } heading={
                                                <div className='flex items-center gap-2 text-start'>
                                                    <div className='p-1.5 rounded-md bg-[#f0f0f0]'><ShieldCheck size={20} /></div>
                                                    <h1 className='text-base font-semibold'>Strengths to keep</h1>
                                                </div>
                                            } />

                                        )}

                                        <hr />

                                        {/* Growth Opportunities */}
                                        {analysisData.growth_opportunities && analysisData.growth_opportunities.length > 0 && (
                                            <AnalysisAccordion analysisData={
                                                <div>
                                                    {analysisData.growth_opportunities.map((opportunity: any, index: number) => (
                                                        <div key={index} className="mb-4">
                                                            {opportunity.video_thumbnail && <img src={opportunity.video_thumbnail} alt="" className='w-full h-40 object-cover rounded-lg mb-4' />}
                                                            <h4 className="mb-2 font-medium"><strong>Title:</strong> {opportunity.video_title} - {opportunity.category}</h4>
                                                            <p className="mb-2 text-sm"><strong>• Opportunity:</strong> {opportunity.opportunity}</p>
                                                            <p className="mb-2 text-sm"><strong>• Deep reasoning:</strong> {opportunity.deep_reasoning}</p>
                                                            <p className="text-sm"><strong>• Actionable tip:</strong> {opportunity.actionable_tip}</p>

                                                            {index !== analysisData.growth_opportunities.length - 1 && <hr className='w-40 my-6 mx-auto' />}
                                                        </div>
                                                    ))}
                                                </div>
                                            } heading={
                                                <div className='flex items-center gap-2 text-start'>
                                                    <div className='p-1.5 rounded-md bg-[#f0f0f0]'><TrendingUp size={20} /></div>
                                                    <h1 className='text-base font-semibold'>Growth opportunities</h1>
                                                </div>
                                            } />

                                        )}

                                        <hr />

                                        {/* Macro Recommendations */}
                                        {analysisData.macro_recommendations && (

                                            <AnalysisAccordion analysisData={
                                                <div>
                                                    <div className="space-y-4 text-sm">
                                                        <div>
                                                            <h4 className="font-semibold mb-2">• Best Time to Upload</h4>
                                                            <p>{analysisData.macro_recommendations.best_time_to_upload}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-2">• Hook Strategy</h4>
                                                            <p>{analysisData.macro_recommendations.hook_strategy}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-2">• Title Tips</h4>
                                                            <p>{analysisData.macro_recommendations.title_tips}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-2">• Description Tips</h4>
                                                            <p>{analysisData.macro_recommendations.description_tips}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-2">• Tags Tips</h4>
                                                            <p>{analysisData.macro_recommendations.tags_tips}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-2">• Editing and Visuals</h4>
                                                            <p>{analysisData.macro_recommendations.editing_and_visuals}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-2">• Voice and Energy</h4>
                                                            <p>{analysisData.macro_recommendations.voice_and_energy}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-2">• Content Ideas</h4>
                                                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                                                {analysisData.macro_recommendations.content_ideas.map((idea: string, index: number) => (
                                                                    <p key={index}>{`• ${idea}`}</p>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            } heading={
                                                <div className='flex items-center gap-2 text-start'>
                                                    <div className='p-1.5 rounded-md bg-[#f0f0f0]'><Star size={20} /></div>
                                                    <h1 className='text-base font-semibold'>Macro recommendations</h1>
                                                </div>
                                            } />

                                        )}
                                    </div>

                                    {isCompleted && !isDeepAnalysis && (
                                        <div className='flex flex-col gap-3 px-2 mt-6'>
                                            <h1 className='text-sm text-[#595959] font-medium'>Need deep analysis? Get a full expert-level breakdown of your channel's performance, retention issues, and growth strategy. (May take 40–60 seconds.)</h1>
                                            <button className='text-[13px] px-4 py-2 bg-[#9c3313] text-white rounded-sm hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 w-fit flex items-center gap-2' onClick={() => {
                                                setAnalysisData(null);
                                                setIsCompleted(false);
                                                setIsDeepAnalysis(true);
                                                analyzeOverallVideos(true);
                                            }}>
                                                <MdAutoAwesome size={16} /> Deep Analysis
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isLoading && !analysisData && (
                                <div className='text-center absolute flex px-6 flex-col items-center justify-center top-0 left-0 w-full h-full'>
                                    <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                                        <MdAutoAwesome className='text-gray-400' size={32} />
                                    </div>
                                    <p className='text-lg font-medium text-[#231b1a] mb-2'>
                                        No analysis data available
                                    </p>
                                    <p className='text-sm text-[#5b5b5b]'>
                                        Your overall videos analysis data will show here
                                    </p>
                                </div>
                            )}
                        </div >
                    }
                />
            </div >
        </>
    )
}

export default OverallVideos