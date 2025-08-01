import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FaArrowRight, FaPlay, FaRobot } from 'react-icons/fa'

const VideoTemplate = () => {
    return (
        <div className='w-full h-28 rounded-md flex items-center bg-white/10 justify-center'><FaPlay size={25} color='#9c3313' /></div>
    )
}

const GrowthWay = () => {
    return (
        <div className="mt-36 mb-20 flex max-w-4xl mx-auto flex-col items-center justify-center w-full text-white gap-4">
            <div className='py-1.5 px-4 bg-white/10 rounded-full flex items-center gap-2'>
                <h1 className='text-sm font-medium flex items-center gap-2'> <p className='h-[2px] w-3 bg-[#9c3313]'></p> The Smart Way to Grow <p className='h-[2px] w-3 bg-[#9c3313]'></p></h1>
            </div>

            <h1 className='text-[30px] sm:text-4xl md:text-5xl mt-4 max-w-lg w-full mx-auto text-center leading-tight font-bold'>
                How We Help You Grow <span className='growth-gradient'>Faster</span>
            </h1>

            <p className='text-xs sm:text-sm text-center max-w-xl w-full mx-auto text-white/80'>We analyze your recent videos, break down what’s working, and feed it directly into AI to give you personalized insights, improvements, and content ideas.</p>

            <div className='bg-[#231716] relative h-fit mt-2 w-full border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center'>

                <div className='w-full flex flex-col sm:flex-row items-center'>
                    <div className='relative w-full flex flex-col gap-6 h-full'>
                        <h1 className='font-semibold w-[85%] sm:w-auto text-lg px-2'>We pass your latest videos to Pulsey</h1>

                        <div className='flex h-full flex-col sm:flex-row w-full items-center'>
                            <div className='flex items-center sm:items-start sm:flex-col w-full sm:w-[50%] gap-2'>
                                <VideoTemplate />
                                <VideoTemplate />
                                <VideoTemplate />
                            </div>

                            <div className='w-[70%] sm:w-[50%] flex flex-col sm:flex-row items-center'>
                                <div className='w-full flex flex-row sm:flex-col sm:w-[50%]'>
                                    <div className='bg-transparent sm:border-t-2 border-b-2 border-l-2 sm:border-l-0 rounded-bl-2xl sm:rounded-bl-none border-r-2 sm:rounded-tr-2xl border-white/10 h-[8rem] w-full'></div>
                                    <div className='bg-transparent border-b-2 border-r-2 rounded-br-2xl border-white/10 h-[8rem] w-full'></div>
                                </div>

                                <hr className='border-[1.4px] hidden sm:block -translate-y-[1px] border-white/10 w-[50%]' />
                                <div className='sm:hidden h-28 w-[2px] bg-white/10'></div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='w-fit flex justify-center lg:mr-10'>
                    <div className='robot-circle h-40 w-40 rounded-full flex items-center justify-center sm:translate-y-[20px] border-2 border-white/10'>
                        {/* <FaRobot size={50} color='#d94010' /> */}
                        <img src="/Images/main/chatbot.png" alt="" className='w-20 h-20 object-cover' />
                    </div>
                </div>

                <Link href={`/auth/sign-in?redirect=/dashboard/analyze-videos&videoUrl=&videoDescription=`}><button title='Get Analysis' className='absolute top-5 hover:bg-[#9c3313] cursor-pointer transition-all duration-300 w-12 h-12 rounded-full border border-[#9c3313] gap-2 flex justify-center flex-col items-center text-center right-5'>
                    <ArrowRight size={25} style={{ strokeWidth: '2' }} className='-rotate-45' />
                </button></Link>

                <div className='mt-6 sm:mt-0 sm:absolute sm:bottom-5 w-60 gap-2 flex justify-center flex-col items-center text-center right-2 lg:right-7'>
                    <h1 className='font-semibold'>Turn Into Analyzer</h1>
                    <p className='text-xs text-white/60'>Pulsey breaks down every part of your video, compares it with trending content, and shows exactly what to improve to grow faster.</p>
                </div>
            </div>
        </div>
    )
}

export default GrowthWay
