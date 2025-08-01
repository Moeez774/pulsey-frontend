'use client'
import React, { SetStateAction, Dispatch, useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import ToolTip from '../../components/ToolTip';
import { ChevronLeft, Info } from 'lucide-react';
import { FaSearch } from 'react-icons/fa';
import { MdAutoAwesome } from 'react-icons/md';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '@/context/AuthProvider';
import AIResponse from '@/components/common/AIResponse';
import TypeWriter from '@/components/common/TypeWriter';

interface TrendData {
    date: string;
    [key: string]: any;
}

interface GoogleTrendsProps {
    accessToken?: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const IdeaCard = ({ index, children }: { index: number, children: React.ReactNode }) => {
    return (
        <div>
            {children}
        </div>
    );
}

const Trends = ({ accessToken, isOpen, setIsOpen }: GoogleTrendsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')
    const [gettingIdeas, setGettingIdeas] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('')
    const [hasShown, setHasShown] = useState(false)
    const [trendsData, setTrendsData] = useState<TrendData[]>([]);
    const [relatedQueries, setRelatedQueries] = useState<any>(null);
    const [ideas, setIdeas] = useState<any>(null)
    const authContext = useAuth()
    const { user } = authContext

    const fetchTrends = async () => {
        if (!searchKeyword) {
            toast.error('Please enter a keyword to search for trends');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/trends?keyword=${encodeURIComponent(searchKeyword)}`, {
                headers: {
                    Authorization: `Bearer ${accessToken as string}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trends data');
            }

            const data = await response.json();

            if (data.error) {
                toast.error(data.error, { id: 'get-trends' });
                return;
            }

            setTrendsData(data.queries.interest_over_time || []);
            setRelatedQueries(data.queries.related_queries || null);
        } catch (err: any) {
            toast.error(err.message, { id: 'get-trends' });
            setTrendsData([]);
            setRelatedQueries(null);
        } finally {
            setIsLoading(false);
        }
    };

    const getIdeasFromTrends = async () => {
        if (!trendsData.length || !searchKeyword) return;
        setGettingIdeas(true);
        setIsLoading(true);

        const readableTrends = trendsData.map(trend => {
            const date = new Date(trend.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const value = trend[searchKeyword] || 0;
            return `${formattedDate}: ${value}/100 interest level`;
        }).join('\n');

        let relatedQueriesText = '';
        if (relatedQueries) {
            if (relatedQueries.top) {
                relatedQueriesText += '\n\nTop Related Queries:\n' + relatedQueries.top;
            }
            if (relatedQueries.rising) {
                relatedQueriesText += '\n\nRising Related Queries:\n' + relatedQueries.rising;
            }
        }

        const summary = `Keyword: ${searchKeyword}\n\nTrend Data:\n${readableTrends}${relatedQueriesText}`;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/get-trending-ideas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: summary, user_query: searchKeyword, user_id: user._id, related_queries: relatedQueries })
            })

            if (!response.ok) {
                toast.error('Failed to fetch ideas', { id: 'get-ideas' });
                return;
            }

            const data = await response.json();

            if (data.success) {
                if (typeof data.data === 'string') {
                    const parsedData = JSON.parse(data.data);
                    setIdeas(parsedData);
                    setHasShown(true)
                } else {
                    setIdeas(data.data);
                    setHasShown(true)
                }
            }
        } catch (err: any) {
            toast.error(err.message, { id: 'get-ideas' });
        } finally {
            setGettingIdeas(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setTrendsData([])
            setRelatedQueries(null)
            setIdeas(null)
            setSearchKeyword('')
            setIsLoading(false)
            setGettingIdeas(false)
            setHasShown(false)
        }
    }, [isOpen])

    return (
        <>

            <div className='absolute'>
                <AIResponse heading='Trends Over Time' showFeedback={!hasShown} isOpen={isOpen} setIsOpen={setIsOpen} content={
                    <div className='mt-4 h-full'>

                        {!ideas && <div className='flex flex-col gap-4 h-fit'>
                            <div className='flex gap-4'>
                                <Input onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        fetchTrends()
                                    }
                                }} className='rounded-full' placeholder='Search for a trend' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                            </div>

                            <button disabled={isLoading || gettingIdeas} onClick={fetchTrends} className={`flex items-center w-full justify-center active:scale-95 transition-all duration-300 text-sm gap-2 bg-[#b13813] rounded-full text-white px-4 py-2 shadow-lg ${isLoading || gettingIdeas ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}><FaSearch size={16} /> Search</button>

                            <hr className='w-[90%] mx-auto mb-6 border-[#f0f0f0]' />
                        </div>}

                        {ideas && (
                            <button onClick={() => {
                                setGettingIdeas(false)
                                setIsLoading(false)
                                setHasShown(false)
                                setTrendsData([])
                                setRelatedQueries(null)
                                setSearchKeyword('')
                                setIdeas(null)
                            }} className='flex items-center w-full justify-center active:scale-95 transition-all duration-300 cursor-pointer text-sm gap-2 bg-[#b13813] rounded-full text-white mb-4 px-4 py-2 shadow-lg'><ChevronLeft size={16} /> Search Again</button>
                        )}

                        <div className='flex-1 flex h-fit justify-center items-center flex-col gap-4'>

                            {isLoading && (
                                <div className='mt-10'>
                                    <div className="loader"></div>
                                    <p className='text-sm text-[#202020] mt-10 text-center font-medium'>{gettingIdeas ? 'Getting ideas...' : 'Searching for trends...'}</p>

                                    {gettingIdeas && <p className='text-xs text-[#7c6f6b] mt-2 text-center font-medium'>This may take a few seconds...</p>}
                                </div>
                            )}

                            {!isLoading && !trendsData.length && !searchKeyword && (
                                <div className='text-center mt-10'>
                                    <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                                        <FaSearch className='text-gray-400' size={32} />
                                    </div>
                                    <p className='text-lg font-medium text-[#231b1a] mb-2'>No trends found</p>
                                    <p className='text-sm text-[#5b5b5b]'>Enter a keyword to see how it is trending over the past 30 days</p>
                                </div>
                            )}

                            {!isLoading && trendsData.length > 0 && !gettingIdeas && !ideas && (
                                <div className='w-full space-y-4'>

                                    <div className='flex flex-col w-full md:flex-row md:justify-between'>
                                        <div className='mb-6 w-full md:w-[60%]'>
                                            <h3 className='text-xl font-bold text-[#231b1a] mb-2'>Trending: "{searchKeyword}"</h3>
                                            <p className='text-sm text-[#5b5b5b]'>Interest over time (0-100 scale)</p>
                                        </div>

                                        <div className='w-full justify-end sm:justify-start md:w-[40%] flex md:justify-end'>
                                            <button onClick={getIdeasFromTrends} className='text-xs h-fit font-medium px-3 rounded-sm border-[#cfcfcf] py-[7px] border shadow-sm hover:bg-[#f0f0f0] transition-all duration-200 flex items-center gap-2'><MdAutoAwesome size={16} /> Get Ideas</button>
                                        </div>
                                    </div>

                                    <div className='space-y-3 h-full overflow-y-auto'>
                                        {trendsData.map((trend, index) => {
                                            const date = new Date(trend.date);
                                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                            const value = trend[searchKeyword] || 0;
                                            const percentage = value;

                                            return (
                                                <div key={trend.date} className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
                                                    <div className='flex items-center justify-between mb-2'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='w-12 h-12 bg-gradient-to-r from-[#d94010] to-[#9c3313] rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                                                                {dayName}
                                                            </div>
                                                            <div>
                                                                <p className='font-semibold text-[#231b1a]'>{monthDay}</p>
                                                                <p className='text-xs text-[#5b5b5b]'>{date.getFullYear()}</p>
                                                            </div>
                                                        </div>
                                                        <div className='text-right'>
                                                            <p className='text-2xl font-bold text-[#9c3313]'>{value}</p>
                                                            <p className='text-xs text-[#5b5b5b]'>Interest</p>
                                                        </div>
                                                    </div>

                                                    <div className='relative'>
                                                        <div className='w-full bg-gray-200 rounded-full h-3'>
                                                            <div
                                                                className='bg-gradient-to-r from-[#d94010] via-[#9c3313] to-[#5f2716] h-3 rounded-full transition-all duration-1000 ease-out'
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className='flex justify-between text-xs text-[#5b5b5b] mt-1'>
                                                            <span>0</span>
                                                            <span>50</span>
                                                            <span>100</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {!isLoading && searchKeyword && !trendsData.length && !gettingIdeas && !ideas && (
                                <div className='text-center mt-10'>
                                    <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                                        <FaSearch className='text-gray-400' size={32} />
                                    </div>
                                    <p className='text-lg font-medium text-[#231b1a] mb-2'>No trends found</p>
                                    <p className='text-sm text-[#5b5b5b]'>Try a different keyword or check your search term</p>
                                </div>
                            )}

                            {ideas && !gettingIdeas && (
                                <TypeWriter>
                                    <div className='w-full h-fit text-start bg-white shadow-lg rounded-3xl px-4 py-6 border transition-all duration-500 ease-out'>
                                        <h1 className='text-2xl font-bold text-[#231b1a] mb-4 flex gap-2'><MdAutoAwesome size={20} /> Trending Ideas for "{searchKeyword}"</h1>
                                        <div className='space-y-6'>
                                            {ideas.ideas && ideas.ideas.map((idea: any, index: number) => {

                                                return (
                                                    <TypeWriter key={index}>
                                                        <IdeaCard index={index}>
                                                            <div>
                                                                <h4 className='text-lg font-semibold mb-3'>{`${index + 1}. ${idea.idea}`}</h4>
                                                                <p className='mb-2 text-sm'><strong>Why this idea:</strong> {`${idea.why}`}</p>
                                                                <p className='mb-2 text-sm'><strong>What to cover:</strong> {`${idea.what}`}</p>
                                                                <p className='mb-4 text-sm'><strong>How to implement:</strong> {`${idea.how}`}</p>
                                                            </div>
                                                        </IdeaCard>
                                                    </TypeWriter>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </TypeWriter>
                            )}
                        </div>

                    </div>
                } />
            </div>
        </>
    )
}

export default Trends