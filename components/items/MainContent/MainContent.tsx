'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { FaChartLine, FaInfoCircle, FaSearch, FaYoutube } from 'react-icons/fa';
import { useAuth } from '@/context/AuthProvider';
import Channel from '@/components/common/Channel';
import Analytics from '@/components/items/Analytics/Analytics';
import { toast } from 'sonner';
import { MdAutoAwesome } from 'react-icons/md';
import Trends from '@/components/components/Trends/Trends';
import Overall from '@/components/components/Analysis/Overall';
import ToolTip from '@/components/components/ToolTip';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AIResponse from '@/components/common/AIResponse';
import { Plus } from 'lucide-react';

export function ConnectYouTubeOverlay() {
    const [ask, setAsk] = useState(false)
    const authConext = useAuth()
    const { user, currentPage, analytics, channelData } = authConext
    return (
        <>
            <div className='absolute'>
                <AlertDialog open={ask} onOpenChange={setAsk}>
                    <AlertDialogTrigger></AlertDialogTrigger>
                    <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            Each account can be linked to only one YouTube channel. Once you connect a channel, switching to another will cause you to lose all your data and preferences for the current channel.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className='cursor-pointer' onClick={() => setAsk(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                toast.loading('Connecting...', { id: 'connect' })
                                setAsk(false)
                                signIn('google')
                            }} className='bg-[#9c3313] cursor-pointer hover:bg-[#9c3313]/80'>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className={`absolute inset-0 bg-white/80 m-2 rounded-sm ${currentPage === 'dashboard' ? 'border-none' : 'border'} backdrop-blur-xs z-50 flex items-center justify-center`}>
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="mb-8">
                        <img
                            className="w-40 mx-auto mb-6"
                            src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png"
                            alt="Pulsey Logo"
                        />
                    </div>

                    <h2 className="text-3xl font-bold text-[#231b1a] mb-4 leading-tight">
                        One Click Away from Smarter Growth
                    </h2>

                    <p className="text-[13px] text-black/80 mb-8 leading-relaxed">
                        Connect your YouTube channel and let Pulsey turn your video data into powerful insights, feedback, and next-step ideas.
                    </p>

                    <div onClick={() => {
                        setAsk(true)
                    }} className="bg-gradient-to-r flex items-center justify-center from-[#9c3313] to-[#d94010] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        <Plus size={20} className='mr-2' /> Connect YouTube Channel
                    </div>

                </div>
            </div>
        </>
    )
}

export default function MainContent() {
    const { data: session } = useSession();
    const authConext = useAuth()
    const { user, currentPage, analytics, channelData } = authConext
    const [isOpen, setIsOpen] = useState(false)
    const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)
    const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false)

    const handleSuggestionClick = (suggestion: any) => {
        setSelectedSuggestion(suggestion);
        setSuggestionDialogOpen(true);
    };

    return (
        <>

            <div className='absolute'>
                <Trends accessToken={session?.accessToken as string} isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>

            <section className="flex flex-col bg-[#f3f3f3] items-center w-full h-full lg:h-screen justify-start sm:p-2 relative">
                <div className={`w-full max-w-7xl mx-auto bg-white h-full ${session ? 'lg:overflow-y-auto' : ''} sm:rounded-sm border-t sm:border md:p-8 px-6 py-8 relative`} style={{ scrollbarWidth: 'thin' }}>

                    <div className='flex mb-8 xl:flex-row flex-col gap-4 justify-between xl:items-center'>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#231b1a] mb-1">Welcome back, {user?.fullName?.split(" ")[0].charAt(0).toUpperCase() + user?.fullName?.split(" ")[0].slice(1)}!</h2>
                            <p className="text-[#7c6f6b] flex items-center gap-1">Let's start pulsing <MdAutoAwesome size={20} className='translate-y-0.5' /></p>
                        </div>

                        <div className='flex sm:flex-row flex-col-reverse gap-4 items-center'>
                            <button onClick={() => setIsOpen(true)} className='text-xs w-full sm:w-fit justify-center font-medium px-4 rounded-sm border-[#cfcfcf] py-[10px] border shadow-sm hover:bg-[#f0f0f0] transition-all duration-200 flex items-center gap-2'><FaChartLine size={16} /> Ideas from Trends</button>

                            <Overall analytics={analytics} channelData={channelData} />
                        </div>
                    </div>

                    <div className='w-full'>
                        {session && <Channel />}

                        <hr className='my-8 max-w-2xl border-[#f0f0f0] mx-auto w-full' />

                        {user?.suggestions && user?.suggestions.length > 0 && <div className='flex flex-col gap-6'>
                            <h1 className='text-xl md:text-2xl font-bold flex items-center gap-2 text-[#231b1a]'><MdAutoAwesome size={20} /> Pulsey Suggestions</h1>

                            {user?.suggestions && user?.suggestions.length > 0 && <div className='w-full flex-wrap flex items-center gap-4' style={{ scrollbarWidth: 'none' }}>
                                {user?.suggestions.map((suggestion: any, index: number) => (
                                    <ToolTip key={index} icon={
                                        <div
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className='suggestion-button cursor-pointer rounded-sm py-2 px-4 shadow-lg transition-transform duration-200'
                                        >
                                            <h3 style={{ userSelect: 'none' }} className='text-[13px] sm:text-sm font-medium text-white flex text-start gap-2'>
                                                <MdAutoAwesome size={20} /> {suggestion.idea}
                                            </h3>
                                        </div>
                                    } text="See Why" />
                                ))}
                            </div>}
                        </div>}

                        {user?.suggestions && user?.suggestions.length > 0 && <hr className='my-8 max-w-2xl border-[#f0f0f0] mx-auto w-full' />}

                        {session && <Analytics />}
                        {!session && <ConnectYouTubeOverlay />}
                    </div>
                </div>
            </section >

            <Dialog open={suggestionDialogOpen} onOpenChange={setSuggestionDialogOpen}>
                <DialogContent className='max-h-[80vh] sm:max-w-3xl mx-auto w-full overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle className="flex gap-2 text-lg">
                            <MdAutoAwesome size={20} className="text-[#9c3313] translate-y-1" />
                            {selectedSuggestion?.idea}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div>
                            <h4 className="font-semibold text-xs text-[black] py-1.5 px-3 bg-[#f0f0f0] rounded-full w-fit mb-1">Why This Works</h4>
                            <p className="text-sm ml-3 pt-1 text-gray-700 leading-relaxed">
                                {selectedSuggestion?.why}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-xs text-[black] py-1.5 px-3 bg-[#f0f0f0] rounded-full w-fit mb-1">What to Cover</h4>
                            <p className="text-sm ml-3 pt-1 text-gray-700 leading-relaxed">
                                {selectedSuggestion?.what}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-xs text-[black] py-1.5 px-3 bg-[#f0f0f0] rounded-full w-fit mb-1">How to Structure</h4>
                            <p className="text-sm ml-3 pt-1 text-gray-700 leading-relaxed">
                                {selectedSuggestion?.how}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className='absolute'>
                <AIResponse
                    content={<div>AI Response content here</div>}
                    heading="AI Response"
                    isOpen={false}
                    setIsOpen={() => { }}
                    showFeedback={true}
                />
            </div>
        </>
    );
} 