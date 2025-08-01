'use client'

import React, { useState, useRef } from 'react'
import { MdAutoAwesome, MdLink, MdDescription } from 'react-icons/md'
import { toast } from 'sonner'
import { Info } from 'lucide-react'

const TopSection = ({ analyzeWithAI, isAnalyzing, isRawTranscript, transcript }: { analyzeWithAI: () => Promise<void>, isAnalyzing: boolean, isRawTranscript: boolean, transcript: string }) => {

    const [isGettingTranscript, setIsGettingTranscript] = useState(false)
    const transcriptContainerRef = useRef<HTMLDivElement>(null)
    

    return (
        <div className='relative flex h-full justify-normal items-center w-full flex-col'>

            <div className='w-full h-full' ref={transcriptContainerRef}>
                {isGettingTranscript && (
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center">
                            <div className="loader"></div>
                        </div>
                        <h3 className="text-lg font-medium text-[#231b1a] mb-2">Getting transcript</h3>
                        <p className="text-sm text-[#7c6f6b]">Please wait while we process your request...</p>
                    </div>
                )}

                {!isGettingTranscript && transcript && !isAnalyzing && (
                    <div className='rounded-sm w-full flex flex-col gap-6 bg-white'>
                        <div className='w-full flex items-center justify-between'>
                            <div className='flex w-[60%] flex-col gap-1'>
                                <h3 className="text-xl font-semibold text-[#231b1a]">Transcript</h3>
                               { !isRawTranscript && <p className='text-xs text-[#7c6f6b] flex gap-1'><Info className='translate-y-[1px]' size={14} />Based on YouTube API Data — Interpreted by Pulsey AI
                                </p> }
                            </div>
                            <button
                                onClick={analyzeWithAI}
                                disabled={isAnalyzing}
                                className='text-xs font-medium px-3 bg-[#9c3313] justify-center text-white rounded-sm py-[7px] hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 flex items-center w-fit gap-2'
                            >
                                <MdAutoAwesome size={16} className="inline" />
                                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                            </button>
                        </div>
                        <p className="text-sm text-[#7c6f6b]">{transcript}</p>
                    </div>
                )}

                {!isGettingTranscript && !transcript && (
                    <div className="text-center h-full flex flex-col justify-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <MdAutoAwesome className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-[#231b1a] mb-2">No transcript found</h3>
                        <p className="text-sm text-[#7c6f6b]">Please enter a YouTube URL or transcript to analyze.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TopSection 