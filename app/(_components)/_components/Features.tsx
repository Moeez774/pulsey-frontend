import { ChevronRight, Plus, Text } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { MdAutoAwesome } from 'react-icons/md'

const Features = () => {
    return (
        <div className="mt-40 mb-28 z-10 flex flex-col w-full text-white lg:px-6 gap-4">
            <div className='py-1.5 px-4 bg-white/10 w-fit rounded-full flex items-center gap-2'>
                <h1 className='text-sm font-medium flex items-center gap-2'> <p className='h-[2px] w-3 bg-[#9c3313]'></p> Features <p className='h-[2px] w-3 bg-[#9c3313]'></p></h1>
            </div>

            <h1 className='text-3xl sm:text-4xl max-w-[44rem] w-full md:text-5xl leading-tight font-bold'>
                Your go-to tool for going viral on Youtube <span className='growth-gradient'>using AI.</span>
            </h1>

            <p className='text-xs sm:text-sm max-w-xl w-full text-white/80'>From feedback to ideas, Pulsey helps you grow faster with AI that understands your content.</p>

            <div className='flex items-center gap-6 mt-6'>
                <Link href="/auth/sign-in"><button className='get-started-button w-fit text-sm sm:text-base flex items-center gap-2 py-3 cursor-pointer border border-white/20 px-6 rounded-full text-white font-medium'>Try Free <ChevronRight size={20} /></button></Link>
                <Link href="/guide"><button className='hover:bg-white/10 rounded-full text-[15px] cursor-pointer transition-all duration-300 border border-white/20 text-white px-6 py-3'>Learn More</button></Link>
            </div>

            <div className='w-full mt-10 flex flex-col gap-4'>
                <div className='w-full flex flex-col md:flex-row items-center gap-4'>
                    <div className='md:w-[40%] w-full border flex md:hidden justify-center items-center border-white/10 h-[18em] bg-[#231716] rounded-3xl'>

                        <div className='flex w-full gap-6 flex-col justify-center items-center p-2'>
                            <div className='flex w-full items-center justify-center'>
                                <div className='w-[25%] h-0.5 bg-gradient-to-l from-[#9c3313] to-transparent z-0'></div>
                                <div className='bg-white rounded-full p-2 w-fit'>
                                    <img className='sm:w-[10rem] w-[8rem]' src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png" alt="" />
                                </div>
                                <div className='w-[25%] h-0.5 bg-gradient-to-r from-[#9c3313] to-transparent z-0'></div>
                            </div>

                            <h1 className='text-3xl w-full sm:text-4xl text-center leading-tight font-bold'>
                                Your AI-Powered Youtube <span className='growth-gradient'>Coach</span>
                            </h1>
                        </div>

                    </div>
                    <div className='md:w-[30%] w-full border flex flex-col items-center justify-around px-4 lg:px-6 pt-10 border-white/10 h-[18em] bg-[#231716] rounded-3xl'>

                        <div className='w-full flex items-center gap-6 lg:gap-10 justify-around md:justify-center'>
                            <img className='lg:w-12 w-13 sm:w-16 md:w-10 rotate-12 -translate-y-4' src="/Images/main/transcript (1).png" alt="" />
                            <img className='lg:w-12 w-13 sm:w-16 md:w-10 -rotate-45 translate-y-4' src="/Images/main/transcript.png" alt="" />
                            <img className='lg:w-12 w-13 sm:w-16 md:w-10 rotate-30 -translate-y-6' src="/Images/main/transcription.png" alt="" />
                        </div>

                        <div className='flex text-center flex-col gap-2'>
                            <h1 className='text-sm font-medium'>Understand What You Really Said</h1>
                            <p className='text-xs sm:text-[13px] leading-[20px] text-white/80'>We break down your words, tone, and delivery to show what’s working and what’s holding your content back.</p>
                        </div>

                    </div>
                    <div className='md:w-[40%] hidden w-full border md:flex justify-center items-center border-white/10 h-[18em] bg-[#231716] rounded-3xl'>

                        <div className='flex w-full gap-6 flex-col justify-center items-center p-2'>
                            <div className='flex w-full items-center justify-center'>
                                <div className='w-[25%] h-0.5 bg-gradient-to-l from-[#9c3313] to-transparent z-0'></div>
                                <div className='bg-white rounded-full p-2 w-fit'>
                                    <img className='lg:w-[8.5rem] w-[7rem]' src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png" alt="" />
                                </div>
                                <div className='w-[25%] h-0.5 bg-gradient-to-r from-[#9c3313] to-transparent z-0'></div>
                            </div>

                            <h1 className='text-2xl w-full md:text-3xl lg:text-4xl text-center leading-tight font-bold'>
                                Your AI-Powered Youtube <span className='growth-gradient'>Coach</span>
                            </h1>
                        </div>

                    </div>

                    <div className='md:w-[30%] w-full px-4 lg:px-6 pt-4 border border-white/10 flex flex-col justify-around items-center h-[18em] bg-[#231716] rounded-3xl'>

                        <div className='flex w-full justify-around items-center gap-2'>
                            <MdAutoAwesome color='#fff' className='translate-y-6 glowing-icon' size={28} />
                            <img className='lg:w-24 w-24 sm:w-28 md:w-20' src="/Images/main/chip.png" alt="" />
                            <MdAutoAwesome color='#fff' className='-translate-y-6 glowing-icon' size={28} />
                        </div>

                        <div className='flex text-center flex-col gap-2'>
                            <h1 className='text-sm font-medium'>Get Praised, Then Get Better</h1>
                            <p className='text-xs sm:text-[13px] leading-[20px] text-white/80'>Real feedback from AI that understands creators: what worked, what didn’t, and where to grow next.</p>
                        </div>

                    </div>

                </div>

                <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div className='w-full border border-white/10 h-[18em] flex flex-col justify-end p-7 gap-10 items-center bg-[#231716] rounded-3xl'>

                        <div className='flex items-center h-full mt-10 gap-2 justify-center'>

                            <div className='p-1 rounded-sm border-2 border-white'>
                                <img className='w-6 sm:w-8 md:w-6' src="/Images/main/title.png" alt="" />
                            </div>

                            <Plus size={20} />

                            <div className='p-1 rounded-sm border-2 border-white'>
                                <img className='w-6 sm:w-8 md:w-6' src="/Images/main/carabiner.png" alt="" />
                            </div>

                            <Plus size={20} />

                            <div className='p-1 rounded-sm border-2 border-white'>
                                <img className='w-6 sm:w-8 md:w-6 translate-y-0.5' src="/Images/main/hashtag.png" alt="" />
                            </div>

                        </div>

                        <div className='flex text-center flex-col gap-2'>
                            <h1 className='text-sm font-medium'>AI That Helps You Get Clicked</h1>
                            <p className='text-xs sm:text-[13px] leading-[20px] text-white/80'>From thumb-stopping titles to trending tags, Pulsey crafts content that drives clicks.</p>
                        </div>

                    </div>

                    <div className='w-full px-6 pt-4 border border-white/10 flex flex-col justify-around items-center h-[18em] bg-[#231716] rounded-3xl'>

                        <div className='flex w-full justify-around items-center gap-2'>
                            <img className='w-8 sm:w-10 md:w-8 glowing-icon -translate-y-6' src="/Images/main/trend.png" alt="" />
                            <img className='w-24 sm:w-28 md:w-24' src="/Images/main/bar-chart.png" alt="" />
                            <img className='w-8 sm:w-10 md:w-8 glowing-icon translate-y-6' src="/Images/main/trend.png" alt="" />
                        </div>

                        <div className='flex text-center flex-col gap-2'>
                            <h1 className='text-sm font-medium'>AI + Google Trends = Viral Ideas</h1>
                            <p className='text-xs sm:text-[13px] leading-[20px] text-white/80'>We scan real-time search trends and suggest video ideas that match what your audience is looking for.</p>
                        </div>

                    </div>

                    <div className='w-full px-6 pt-10 pb-6 md:pt-4 border border-white/10 flex flex-col justify-around items-center h-fit gap-10 md:gap-6 md:h-[18em] bg-[#231716] rounded-3xl'>

                        <div className='flex w-full justify-around items-center gap-2'>
                            <img className='w-[28%] scale-95 rounded-md' src="/Images/main/freepik__the-style-is-candid-image-photography-with-natural__26985.jpeg" alt="" />
                            <img className='w-[28%] scale-110 rounded-md border-2 border-white/10' src="/Images/main/freepik__the-style-is-candid-image-photography-with-natural__26984.jpeg" alt="" />
                            <img className='w-[28%] scale-95 rounded-md' src="/Images/main/freepik__the-style-is-candid-image-photography-with-natural__26986.jpeg" alt="" />
                        </div>

                        <div className='flex text-center flex-col gap-2'>
                            <h1 className='text-sm font-medium'>One Dashboard. Every Metric That Matters.</h1>
                            <p className='text-xs sm:text-[13px] leading-[20px] text-white/80'>From content performance to growth patterns, Pulsey breaks down your entire channel with clean visuals and smart AI suggestions</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Features