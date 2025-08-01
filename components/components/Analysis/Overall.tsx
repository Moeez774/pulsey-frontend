import React, { useEffect, useState } from 'react'
import { MdAutoAwesome } from 'react-icons/md'
import { toast } from 'sonner';
import { FaSearch } from 'react-icons/fa';
import AIResponse from '@/components/common/AIResponse';
import TypeWriter from '@/components/common/TypeWriter';
import { useAuth } from '@/context/AuthProvider';

const AnalysisCard = ({ children, index }: { children: React.ReactNode; index?: number }) => {
    return (
        <div>
            <p className="text-sm text-gray-700 flex gap-2">{children}</p>
        </div>
    );
};


const Overall = ({ analytics, channelData }: { analytics: any, channelData: any }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const [isDeepAnalysis, setIsDeepAnalysis] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [overallAnalysis, setOverallAnalysis] = useState<any>(null);

    const readableOverall = async (analytics: any, channelData: any, deepAnalysis: boolean = false) => {
        setIsOpen(true);
        setIsLoading(true);
        setIsCompleted(false);

        try {
            let channelInfo = `Channel Name: ${channelData.name}
        Channel Description: ${channelData.description}
        Subscribers: ${channelData.subscribers}
        Total Views: ${channelData.totalViews}
        Video Count: ${channelData.videoCount}
        `;

            const headers = analytics.columnHeaders.map((h: any) => h.name).join('\t');
            let analyticsRows = analytics.rows.map((row: any[]) => row.join('\t')).join('\n');

            let analyticsInfo = `\nAnalytics Data (tab-separated columns):\n${headers}\n${analyticsRows}\n`;

            const summary = `${channelInfo}\n${analyticsInfo}`;

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/get-overall-analysis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: summary, deep_analysis: deepAnalysis, user_id: user?._id })
            })

            if (!response.ok) {
                toast.error('Failed to fetch overall analysis', { id: 'get-overall-analysis' });
                setIsLoading(false);
                console.log(response.statusText);
                return;
            }

            const data = await response.json();

            if (data.success) {
                setIsCompleted(true);
                if (typeof data.data === 'string') {
                    const parsedData = JSON.parse(data.data);
                    setOverallAnalysis(parsedData.analysis);
                } else {
                    setOverallAnalysis(data.data.analysis);
                }
            }
            else {
                if (data.limit_exceeded) {
                    setIsOpen(false);
                    setIsLoading(false);
                    setIsCompleted(false);
                    setIsDeepAnalysis(false);
                    setOverallAnalysis(null);
                }
                toast.error(data.message || 'Failed to fetch overall analysis', { id: 'get-overall-analysis' });
            }


        } catch (err: any) {
            toast.error("Failed to fetch overall analysis", { id: 'get-overall-analysis' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className='w-full sm:w-fit'>
                <button
                    className='text-[13px] font-medium w-full sm:w-fit justify-center px-4 bg-[#9c3313] text-white rounded-sm py-[10px] hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 flex items-center gap-2'
                    onClick={() => {
                        setIsDeepAnalysis(false);
                        setOverallAnalysis(null);
                        setIsCompleted(false);
                        readableOverall(analytics, channelData, false);
                    }}
                >
                    <MdAutoAwesome size={16} /> Analyze Overall
                </button>
                
            </div>

            <div className='absolute'>
                <AIResponse heading='Overall Analysis' showFeedback={isLoading} isOpen={isOpen} setIsOpen={setIsOpen} ai_response={overallAnalysis}
                    content={
                        <div className='flex text-start justify-start items-start'>
                            {isLoading && (
                                <div className='flex absolute w-full h-screen top-0 left-0 flex-col items-center justify-start'>
                                    <div className="loader"></div>
                                    <div className='-translate-y-10'>
                                        <p className='text-sm text-[#202020] text-center font-medium'>
                                            {isDeepAnalysis ? "Getting deep analysis..." : "Getting overall analysis..."}
                                        </p>
                                        <p className='text-xs text-[#7c6f6b] mt-1.5 text-center font-medium'>
                                            {isDeepAnalysis ? "This may take 40s to 60s" : "This may take a few seconds..."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!isLoading && overallAnalysis && (
                                <div className='flex flex-col w-full gap-3'>
                                    <TypeWriter setIsCompleted={setIsCompleted}>
                                        <div className="space-y-3 p-5 w-full shadow-md rounded-3xl border text-start mt-6">
                                            <div>
                                                <h1 className='text-center text-2xl mb-6 font-bold'>✦ Pulsey's Analysis</h1>
                                                <p className='text-xs text-center text-[#7c6f6b] mt-1'><strong>Note:</strong> These insights are generated by Pulsey AI and are not official YouTube metrics.</p>
                                            </div>

                                            <h2 className="text-lg font-bold mb-2">What's Good</h2>
                                            {overallAnalysis.goods?.map((good: string, idx: number) => (
                                                <TypeWriter key={idx}>
                                                    <AnalysisCard index={idx}>
                                                        {`• ${good}`}
                                                    </AnalysisCard>
                                                </TypeWriter>
                                            ))}

                                            <h2 className="text-lg font-bold mt-6 mb-2">What's Bad</h2>
                                            {overallAnalysis.bads?.map((bad: string, idx: number) => (
                                                <TypeWriter key={idx}>
                                                    <AnalysisCard index={idx}>
                                                        {`• ${bad}`}
                                                    </AnalysisCard>
                                                </TypeWriter>
                                            ))}

                                            <h2 className="text-lg font-bold mt-6 mb-2">Suggestions</h2>
                                            <TypeWriter>
                                                <AnalysisCard index={overallAnalysis.goods?.length + overallAnalysis.bads?.length}>
                                                    {overallAnalysis.suggestions}
                                                </AnalysisCard>
                                            </TypeWriter>
                                        </div>
                                    </TypeWriter>

                                    {isCompleted && !isDeepAnalysis && (
                                        <div className='flex flex-col gap-3 px-2 mt-6'>
                                            <h1 className='text-sm text-[#595959] font-medium'>Need deep analysis? Get a full expert-level breakdown of your channel's performance, retention issues, and growth strategy. (May take 40–60 seconds.)</h1>
                                            <button className='text-[13px] px-4 py-2 bg-[#9c3313] text-white rounded-sm hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 w-fit flex items-center gap-2' onClick={() => {
                                                setOverallAnalysis(null);
                                                setIsDeepAnalysis(true);
                                                readableOverall(analytics, channelData, true);
                                            }}>
                                                <MdAutoAwesome size={16} /> Deep Analysis
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isLoading && !overallAnalysis && (
                                <div className='text-center absolute flex flex-col items-center justify-center top-0 left-0 w-full h-full'>
                                    <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                                        <FaSearch className='text-gray-400' size={32} />
                                    </div>
                                    <p className='text-lg font-medium text-[#231b1a] mb-2'>
                                        No overall analysis found
                                    </p>
                                    <p className='text-sm text-[#5b5b5b]'>
                                        Something went wrong on our end, Please wait while we fix it.
                                    </p>
                                </div>
                            )}
                        </div>
                    }
                />
            </div>
        </>
    )
}

export default Overall