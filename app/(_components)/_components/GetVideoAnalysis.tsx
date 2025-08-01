'use client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import { FaMagic, FaLightbulb, FaVideo, FaRegLightbulb } from 'react-icons/fa'
import { MdAutoAwesome, MdInsertLink } from 'react-icons/md'
import { RiFileSearchLine } from 'react-icons/ri'
import { FiAlertCircle } from 'react-icons/fi'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const GetVideoAnalysis = () => {
    const [videoUrl, setVideoUrl] = useState('')
    const [videoDescription, setVideoDescription] = useState('')
    const router = useRouter()

    const handleAnalyzeVideo = () => {
        if (!videoUrl.trim() || !videoDescription.trim()) {
            toast.error('Please enter a video URL and description')
            return
        }
        router.push(`/auth/sign-in?redirect=/dashboard/analyze-videos&videoUrl=${videoUrl}&videoDescription=${videoDescription}`)
    }

    return (
        <>
            <div className='flex gap-4 items-center flex-col lg:flex-row sm:my-6 lg:justify-between w-full'>
                <div className='bg-[#231716] sm:h-[31em] w-full lg:w-[40%] border border-white/10 rounded-3xl py-6 sm:py-8 px-4 flex flex-col gap-8'>
                    <div className='flex items-start gap-2'>
                        <MdAutoAwesome color='#9c3313' size={25} />
                        <h1 className='text-lg sm:text-xl leading-tight font-bold'>
                            Let AI Break Down Your <span className='growth-gradient'>Video</span>
                        </h1>
                    </div>

                    <div className='flex flex-col gap-3 w-full'>
                        <label htmlFor="video-url" className='text-sm md:text-base'>Paste your video URL</label>
                        <Input className='bg-white/10 h-14 text-sm border-none w-full' placeholder='https://www.youtube.com/watch?v=dQw4w9ERfjejtkQ' value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                    </div>

                    <div className='flex flex-col gap-3 w-full'>
                        <label htmlFor="video-url" className='text-sm md:text-base'>What's happening with this video?</label>
                        <Textarea className='bg-white/10 text-sm h-[7.5rem] resize-none border-none w-full' placeholder='“Struggling to get views lately…”, “I think the title isn’t strong enough.”, “Retention is dropping fast after 20s.”' value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} />
                    </div>

                    <button
                        className="analyze-video-btn w-full py-4 sm:py-5 cursor-pointer border border-[#9c3313] rounded-full text-white font-bold bg-gradient-to-t from-[#9c3313]/40 via-transparent to-transparent shadow-md transition-all duration-300 growth-gradient-text"
                        onClick={handleAnalyzeVideo}
                    >
                        <span className="growth-gradient flex items-center gap-2 justify-center" onClick={handleAnalyzeVideo}><FaMagic color='#9c3313' size={20} /> Analyze Video</span>
                    </button>
                </div>

                <div className='h-fit lg:h-[31em] w-full lg:w-[60%] rounded-3xl flex flex-col gap-6'>
                    <div className='bg-[#231716] h-1/2 flex gap-3 items-center justify-between w-full border border-white/10 rounded-3xl p-4'>
                        <img src="/Images/main/freepik__the-style-is-candid-image-photography-with-natural__87138.jpeg" alt="" className="rounded-xl h-40 w-full sm:w-1/2 lg:w-full lg:h-full object-cover" />
                        <img src="/Images/main/freepik__the-style-is-candid-image-photography-with-natural__87137.jpeg" alt="" className="rounded-xl hidden sm:block h-40 w-1/2 lg:w-full lg:h-full object-cover" />
                    </div>

                    <div className='bg-[#231716] h-fit lg:h-1/2 w-full border border-white/10 rounded-3xl p-4'>
                        <h1 className='text-center font-semibold sm:text-lg'>How Pulsey Works in 5 Smart Steps</h1>
                        <div className="flex items-center gap-8 md:gap-0 justify-between w-full h-3/4 workflow-steps whitespace-nowrap overflow-x-auto my-6 lg:mt-4" style={{ scrollbarWidth: 'none' }}>
                            <div className="flex flex-col items-center flex-1 relative">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#231716] border-2 border-[#9c3313] shadow-md z-10">
                                    <MdInsertLink size={22} color="#9c3313" />
                                </div>
                                <div className="mt-2 text-xs font-semibold text-center">Paste Video</div>
                                <div className="text-[11px] text-center text-white/60">Drop your link</div>
                                <div className="absolute top-[24%] right-0 w-full h-0.5 bg-gradient-to-r from-[#9c3313] to-transparent z-0" style={{ left: '50%', width: 'calc(100% + 1.5rem)', transform: 'translateY(-50%)' }}></div>
                            </div>
                            {/* Step 2 */}
                            <div className="flex flex-col items-center flex-1 relative">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#231716] border-2 border-[#9c3313] shadow-md z-10">
                                    <RiFileSearchLine size={22} color="#9c3313" />
                                </div>
                                <div className="mt-2 text-xs font-semibold text-center">Transcript</div>
                                <div className="text-[11px] text-center text-white/60">Pulsey fetches it</div>
                                <div className="absolute top-[24%] right-0 w-full h-0.5 bg-gradient-to-r from-[#9c3313] to-transparent z-0" style={{ left: '50%', width: 'calc(100% + 1.5rem)', transform: 'translateY(-50%)' }}></div>
                            </div>
                            {/* Step 3 */}
                            <div className="flex flex-col items-center flex-1 relative">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#231716] border-2 border-[#9c3313] shadow-md z-10">
                                    <MdAutoAwesome size={22} color="#9c3313" />
                                </div>
                                <div className="mt-2 text-xs font-semibold text-center">AI Analysis</div>
                                <div className="text-[11px] text-center text-white/60">Content breakdown</div>
                                <div className="absolute top-[24%] right-0 w-full h-0.5 bg-gradient-to-r from-[#9c3313] to-transparent z-0" style={{ left: '50%', width: 'calc(100% + 1.5rem)', transform: 'translateY(-50%)' }}></div>
                            </div>
                            {/* Step 4 */}
                            <div className="flex flex-col items-center flex-1 relative">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#231716] border-2 border-[#9c3313] shadow-md z-10">
                                    <FiAlertCircle size={22} color="#9c3313" />
                                </div>
                                <div className="mt-2 text-xs font-semibold text-center">Feedback</div>
                                <div className="text-[11px] text-center text-white/60">3 wins & 3 fixes</div>
                                <div className="absolute top-[24%] right-0 w-full h-0.5 bg-gradient-to-r from-[#9c3313] to-transparent z-0" style={{ left: '50%', width: 'calc(100% + 1.5rem)', transform: 'translateY(-50%)' }}></div>
                            </div>
                            {/* Step 5 */}
                            <div className="flex flex-col items-center flex-1 relative">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#231716] border-2 border-[#9c3313] shadow-md z-10">
                                    <FaLightbulb size={22} color="#9c3313" />
                                </div>
                                <div className="mt-2 text-xs font-semibold text-center">Next Ideas</div>
                                <div className="text-[11px] text-center text-white/60">Hooks & titles</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-[40rem] mx-auto w-full whitespace-nowrap overflow-x-auto py-4 px-5 bg-[#231716] border mt-10 border-white/10 rounded-full mb-6 flex items-center gap-6 md:gap-2 sm:justify-between' style={{ scrollbarWidth: 'none' }}>
                <div className='flex items-center gap-2'>
                    <h1 className='p-1 rounded-sm border-2 border-white'><FaMagnifyingGlass size={10} /></h1>
                    <h1 className='text-sm'>AI Blind Spot Finder</h1>
                </div>

                <div className='p-1 rotate-45 bg-[#9c3313]'></div>

                <div className='flex items-center gap-2'>
                    <h1 className='p-1 rounded-sm border-2 border-white'><FaVideo size={10} /></h1>
                    <h1 className='text-sm'>AI Video Analyzer</h1>
                </div>

                <div className='p-1 rotate-45 bg-[#9c3313]'></div>

                <div className='flex items-center gap-2'>
                    <h1 className='p-1 rounded-sm border-2 border-white'><FaRegLightbulb size={10} /></h1>
                    <h1 className='text-sm'>Idea's Specialist</h1>
                </div>
            </div>

            <div className='top-[24%] right-0 mb-4 max-w-[40rem] mx-auto w-full pr-6'>
                <div className="w-full h-0.5 bg-gradient-to-l from-[#9c3313] to-transparent z-0" style={{ left: '50%', width: 'calc(100% + 1.5rem)', transform: 'translateY(-50%)' }}></div>
            </div>
        </>
    )
}

export default GetVideoAnalysis