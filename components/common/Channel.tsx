'use client'
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import Cookies from 'js-cookie';
import { Loader2, Pencil, X, Plus, Info, Dot } from 'lucide-react';
import { useSuggestion } from '@/context/SuggestionProvider';
import ToolTip from '../components/ToolTip';
import { toast } from 'sonner';

export default function Channel() {
    const { channelData, isLoading, error, user } = useAuth();
    const { niche } = useSuggestion()
    const [isChangeNiches, setIsChangeNiches] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [niches, setNiches] = useState<string[]>([]);
    const [newNiche, setNewNiche] = useState('');

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-[#f3e9e7] p-6 mb-8">
                <div>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-[#f3e9e7] rounded-full animate-pulse"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-[#f3e9e7] rounded w-3/4 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-[#f3e9e7] rounded w-1/2 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-[#f3e9e7] rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !channelData) {
        return null;
    }

    const formatNumber = (num: string) => {
        const number = parseInt(num);
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toString();
    };

    const handleEditNiches = () => {
        setIsEditing(true);
        if (niches.length > 0) return
        const currentNiches = user?.niche || [];
        setNiches([...currentNiches]);
    };

    const handleRemoveNiche = (indexToRemove: number) => {
        setNiches(niches.filter((_, index) => index !== indexToRemove));
    };

    const handleAddNiche = () => {
        if (newNiche.trim() === '') {
            toast.error('Please enter a niche');
            return;
        }

        if (niches.length === 3) {
            toast.error('You can only add 3 niches');
            return;
        }

        if (newNiche.trim() && !niches.includes(newNiche.trim())) {
            setNiches([...niches, newNiche.trim()]);
            setNewNiche('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddNiche();
        }
    };

    const handleSaveNiches = async () => {
        if (niches.length === 0) {
            toast.error('Please add at least one niche', { id: 'niche' });
            return;
        }
        toast.loading('Saving niches...', { id: 'niche' });

        try {
            const token = Cookies.get('pulsey-auth-token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update-niches`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ niches: niches })
            })

            const data = await res.json();

            if (data.success) {
                toast.success('Niches saved successfully', { id: 'niche' });
                setIsEditing(false);
                setIsChangeNiches(true);
                setNewNiche('');
            } else {
                toast.error(data.message, { id: 'niche' });
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong', { id: 'niche' });
        }

    };

    return (
        <div className="bg-white flex-col flex gap-6 sm:p-6">

            <div className='flex w-full gap-4 xl:flex-row flex-col justify-between'>
                <div className='flex w-full sm:flex-row flex-col gap-6 xl:w-[70%]'>
                    <img className='w-28 md:w-32 h-fit rounded-full' src={channelData?.profileImage} alt="" />

                    <div>
                        <h1 className='text-2xl font-medium'>{channelData?.name}</h1>

                        <div className='flex mt-2 justify-between flex-wrap gap-4'>
                            <div className='flex items-center gap-2'>
                                <h1 className='text-xl font-semibold'>{formatNumber(channelData?.subscribers)}</h1>
                                <h1 className='text-xs mt-1 font-medium text-[#7c6f6b]'>Subscribers</h1>
                            </div>

                            <div className='flex items-center gap-2'>
                                <h1 className='text-xl font-semibold'>{formatNumber(channelData?.totalViews)}</h1>
                                <h1 className='text-xs mt-1 font-medium text-[#7c6f6b]'>Total Views</h1>
                            </div>

                            <div className='flex items-center gap-2'>
                                <h1 className='text-xl font-semibold'>{formatNumber(channelData?.videoCount)}</h1>
                                <h1 className='text-xs mt-1 font-medium text-[#7c6f6b]'>Total Videos</h1>
                            </div>

                        </div>

                        <p className='text-sm text-[#7c6f6b] mt-3 line-clamp-2'>{channelData?.description}</p>

                        <div className='flex flex-col font-medium text-sm justify-center gap-2 mt-4'>

                            {isEditing ? (
                                <>
                                    <div className='flex flex-wrap gap-2'>
                                        {niches.map((n: string, i: number) => (
                                            <div key={i} className='flex items-center gap-1 py-1.5 px-3 rounded-sm bg-[#f0f0f0]'>
                                                <span>{n}</span>
                                                <button
                                                    onClick={() => handleRemoveNiche(i)}
                                                    className='ml-0.5 cursor-pointer hover:bg-[#f7f7f7] rounded-full p-0.5 transition-colors'
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='flex mt-2 items-center gap-1'>
                                        <input
                                            type="text"
                                            value={newNiche}
                                            onChange={(e) => setNewNiche(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Add niche..."
                                            className='py-0.5 px-2 text-sm border-b focus:border-[black] transition-all duration-200 outline-none bg-transparent placeholder-[#7c6f6b]'
                                        />
                                        <ToolTip text='Add Niche' icon={
                                            <div
                                                onClick={handleAddNiche}
                                                className='p-1 bg-[#202020] hover:bg-[#9c3314] cursor-pointer text-white rounded-full transition-colors'
                                            >
                                                <Plus size={12} />
                                            </div>
                                        } />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Show read-only niches */}
                                    {isChangeNiches ? (
                                        <div className='flex flex-wrap gap-2 items-center'>
                                            {niches.map((n: string, i: number) => (
                                                <div key={i} className='py-1.5 px-4 rounded-sm bg-[#f0f0f0]'>{n}</div>
                                            ))}

                                            {niches.length > 0 &&
                                                <ToolTip text='Your niches help Pulsey to find the best ideas for you.' icon={
                                                    <Info size={15} className='translate-y-0.5 cursor-pointer' />
                                                } />
                                            }
                                        </div>
                                    ) : (
                                        <>
                                            <div className='flex items-center flex-wrap gap-2'>
                                                {user?.niche && user?.niche.length > 0 && user?.niche.map((n: string, i: number) => (
                                                    <div key={i} className='py-1.5 px-4 rounded-sm bg-[#f0f0f0]'>{n}</div>
                                                ))}

                                                {user?.niche && user?.niche.length > 0 &&
                                                    <ToolTip text='Your niches help Pulsey to find the best ideas for you.' icon={
                                                        <Info size={15} className='translate-y-0.5 cursor-pointer' />
                                                    } />
                                                }
                                            </div>

                                            <div className='flex items-center flex-wrap gap-2'>
                                                {niche && niche.length > 0 && (!user?.niche || user?.niche.length === 0) && niche.map((n: string, i: number) => (
                                                    <div key={i} className='py-1.5 px-4 rounded-sm bg-[#f0f0f0]'>{n}</div>
                                                ))}
                                            </div>
                                        </>
                                    )}


                                    {(!user?.niche || user?.niche.length === 0) && (!niche || niche.length === 0) &&
                                        <div className='flex items-center gap-2'>
                                            <Loader2 className='animate-spin text-[#9c3314]' size={15} />
                                            <h1 className='text-sm text-[#7c6f6b]'>Getting Niche</h1>
                                        </div>}

                                </>
                            )}
                        </div>
                    </div>


                </div>

                <div className='xl:w-[20%] flex xl:justify-end'>
                    {isEditing ? (
                        <button
                            onClick={handleSaveNiches}
                            className='text-xs font-medium px-4 bg-[#9c3313] text-white rounded-sm py-[8px] hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 flex items-center gap-2 h-fit'
                        >
                            Save Niches
                        </button>
                    ) : (
                        <button
                            onClick={handleEditNiches}
                            className='text-xs font-medium px-3 h-fit rounded-sm border-[#cfcfcf] py-[7px] border shadow-sm hover:bg-[#f0f0f0] transition-all duration-200 flex items-center gap-2'
                        >
                            <Pencil size={15} color='#202020' /> Edit Niches
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 