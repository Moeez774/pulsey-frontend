import { ChevronRight } from 'lucide-react';
import React from 'react';
import GetVideoAnalysis from './GetVideoAnalysis';
import GrowthWay from './GrowthWay';
import Features from './Features';
import Link from 'next/link';

const LandingPage = () => {
    return (
        <div className="landing-page-background min-h-screen relative flex flex-col overflow-hidden">
            <div className="landing-page-overlay"></div>
            <div className="relative mt-4 md:mt-12 z-10 flex flex-col mx-auto max-w-lg sm:max-w-2xl items-center justify-center min-h-screen text-white px-6 gap-4">
                <div className='py-1.5 px-4 bg-white/10 rounded-full flex items-center gap-2'>
                    <h1 className='text-sm font-medium flex items-center gap-2'> <p className='h-[2px] w-3 bg-[#9c3313]'></p> Turn Content into Clarity <p className='h-[2px] w-3 bg-[#9c3313]'></p></h1>
                </div>

                <h1 className='text-5xl md:text-6xl text-center leading-tight font-bold'>
                    Your AI Assistant for YouTube <span className='growth-gradient'>Growth</span>
                </h1>

                <p className='text-xs sm:text-sm text-center max-w-xl w-full mx-auto text-white/80'>Connect your channel and let Pulsey analyze your videos, generate feedback, and suggest your next viral idea, All powered by AI.</p>

                <Link href="/auth/sign-in"><button className='get-started-button text-sm sm:text-base flex items-center gap-2 mt-6 py-3 cursor-pointer border border-white/20 px-6 rounded-full text-white font-medium'>Try Free <ChevronRight size={20} /></button></Link>
            </div>

            <div className='max-w-7xl mx-auto w-full px-4 sm:px-10'>
                <GetVideoAnalysis />
                <GrowthWay />
                <Features />


                <div className="relative mb-12 z-10 flex flex-col mx-auto max-w-lg sm:max-w-3xl items-center justify-center text-white px-6 gap-4">
                    <div className='py-1.5 px-4 bg-white/10 rounded-full flex items-center gap-2'>
                        <h1 className='text-sm font-medium flex items-center gap-2'> <p className='h-[2px] w-3 bg-[#9c3313]'></p> Start Free Now <p className='h-[2px] w-3 bg-[#9c3313]'></p></h1>
                    </div>

                    <h1 className='text-4xl md:text-5xl text-center leading-tight font-bold'>
                    Ready to Grow <span className='growth-gradient'>Smarter?</span>
                    </h1>

                    <p className='text-xs sm:text-sm text-center max-w-xl w-full mx-auto text-white/80'>Connect your channel, get personalized feedback, and start growing with tools designed for creators.</p>

                    <Link href="/auth/sign-in"><button className='get-started-button text-sm sm:text-base flex items-center gap-2 mt-6 py-3 cursor-pointer border border-white/20 px-6 rounded-full text-white font-medium'>Try Now For Free <ChevronRight size={20} /></button></Link>
                </div>
            </div>

        </div>
    );
};

export default LandingPage; 