'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import ToolTip from '../components/ToolTip';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthProvider';

interface AIResponseProps {
    content: React.ReactNode;
    heading: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    showFeedback: boolean;
    ai_response?: any;
}

const AIResponse = ({ content, heading, isOpen, setIsOpen, showFeedback, ai_response }: AIResponseProps) => {
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [isGiven, setIsGiven] = useState(false);
    const { user } = useAuth()

    const handleLike = async () => {
        setLike(true)
        setDislike(false)
        const id = uuidv4()

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedback/helpful`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    feedback_from: user._id,
                    liked: true,
                    ai_response: ai_response
                })
            })

            if (!res.ok) {
                toast.error('Something went wrong', { id: 'feedback' })
                setLike(false)
                setDislike(false)
            }

            const response = await res.json()

            if (response.success) {
                setIsGiven(true)
            }
        } catch (err: any) {
            toast.error(err.message, { id: 'feedback' })
        }
    }

    const handleDislike = async () => {
        setDislike(true)
        setLike(false)
        const id = uuidv4()

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedback/not-helpful`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    feedback_from: user._id,
                    disliked: true,
                    ai_response: ai_response
                })
            })

            if (!res.ok) {
                toast.error('Something went wrong', { id: 'feedback' })
                setLike(false)
                setDislike(false)
            }

            const response = await res.json()

            if (response.success) {
                setIsGiven(true)
            }
        } catch (err: any) {
            toast.error(err.message, { id: 'feedback' })
        }
    }

    useEffect(() => {
        if (!isOpen || !ai_response) {
            setLike(false)
            setDislike(false)
            setIsGiven(false)
        }
    }, [isOpen, ai_response])
    return (
        <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger></SheetTrigger>
                <SheetContent className='min-h-screen sm:max-w-lg w-full border-none overflow-y-auto'>
                    <SheetHeader>
                        <SheetTitle>{heading}</SheetTitle>
                        <div>
                            {content}
                        </div>
                    </SheetHeader>
                    {!showFeedback && (
                        <SheetFooter className='pt-0 px-4 pb-6'>
                            <div className='flex items-center justify-between px-2 w-full'>
                                <h1 className='text-xs font-medium text-gray-500'>{isGiven ? 'Thank you for your feedback!' : 'Was this helpful?'}</h1>

                               {!isGiven && <div className='flex items-center gap-2'>
                                    <ToolTip icon={
                                        <div onClick={handleLike} className='hover:bg-[#f0f0f0] cursor-pointer p-2 rounded-full transition-all duration-300'>
                                            <ThumbsUp size={18} fill={like ? '#d94010' : 'none'} className={`${like ? 'text-[#d94010]' : 'text-gray-500'} transition-all active:scale-90 duration-200`} />
                                        </div>
                                    } text='This was helpful' />

                                    <ToolTip icon={
                                        <div onClick={handleDislike} className='hover:bg-[#f0f0f0] cursor-pointer p-2 rounded-full transition-all duration-100'>
                                            <ThumbsDown size={18} fill={dislike ? '#d94010' : 'none'} className={`${dislike ? 'text-[#d94010]' : 'text-gray-500'} transition-all duration-200 active:scale-90`} />
                                        </div>
                                    } text='This was not helpful' />
                                </div> }
                            </div>
                        </SheetFooter>
                    )}
                </SheetContent>
            </Sheet>
        </div >
    )
}

export default AIResponse