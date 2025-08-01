'use client'

import { ChevronRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

const Header = () => {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/dashboard') || pathname === '/pricing' || pathname === '/guide' || pathname === '/privacy-policy' || pathname === '/terms-of-services'
    if (isAuthPage) return null

    return (
        <div className='flex justify-between items-center my-4 mx-4 sm:mx-6'>
            <div
                className={`${pathname === '/' ? 'bg-[#fefefe]/20' : 'bg-[#9c3313]'
                    } backdrop-blur-md flex gap-5 items-center w-fit p-2 rounded-full`}
            >
                <Link href="/">
                    <button className='bg-white cursor-pointer rounded-full p-2'>
                        <img
                            className='w-24 sm:w-28 md:w-24'
                            src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png"
                            alt="Pulsey Logo"
                        />
                    </button>
                </Link>

                <div className='hidden md:flex items-center gap-4'>
                    <Link href="/pricing">
                        <button className='hover:bg-white/10 rounded-full text-[15px] cursor-pointer transition-all duration-300 border border-white/20 text-white px-4 py-2'>
                            Pricing
                        </button>
                    </Link>
                    <Link href="/guide">
                        <button className='hover:bg-white/10 rounded-full text-[15px] cursor-pointer transition-all duration-300 border border-white/20 text-white px-4 py-2'>
                            Guide
                        </button>
                    </Link>
                </div>
            </div>

            {/* Right Section: Desktop and Mobile CTA + Menu */}
            <Link href="/auth/sign-in">
                <button className='get-started-button py-3 text-sm md:text-base hidden lg:flex items-center gap-2 cursor-pointer border border-white/20 px-5 md:px-6 rounded-full text-white font-medium'>
                    Try Pulsey Free <ChevronRight size={20} />
                </button>
            </Link>

            <div className='flex lg:hidden items-center gap-4'>
                <Link href="/auth/sign-in">
                    <button className='get-started-button py-3 text-sm md:text-base flex items-center gap-2 cursor-pointer border border-white/20 px-5 md:px-6 rounded-full text-white font-medium'>
                        Try Free <ChevronRight size={20} />
                    </button>
                </Link>
                <button onClick={() => setIsOpen(true)} className='md:hidden cursor-pointer'>
                    <Menu color='white' />
                </button>
            </div>

            <div className='absolute'>
                {/* Mobile Sheet Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger />
                    <SheetContent className='sm:max-w-xs w-full bg-[#9c3313]/30 border-none text-white'>
                        <SheetHeader>
                            <SheetTitle />
                            <div className='flex flex-col mt-12'>
                                <Link href="/pricing">
                                    <button className='p-3 transition-all duration-200 active:bg-[#9c3313]/50 text-start w-full text-base'>
                                        Pricing
                                    </button>
                                </Link>
                                <Link href="/guide">
                                    <button className='p-3 transition-all duration-200 active:bg-[#9c3313]/50 text-start w-full text-base'>
                                        Guide
                                    </button>
                                </Link>
                            </div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default Header
