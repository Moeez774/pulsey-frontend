'use client'
import { useAuth } from '@/context/AuthProvider';
import { Home, Layers, BarChart2, Settings, Bookmark, ChevronDown, Plus, LogOut, Video, Speaker, Pen, Play, Mic, DollarSign, ChartBar } from 'lucide-react';
import React, { SetStateAction, Dispatch, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn, signOut, useSession } from "next-auth/react";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaDollarSign, FaMicrophone, FaPen, FaSpeakap } from 'react-icons/fa';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion-sidebar"
import Link from 'next/link';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const LeftToolTip = ({ children, content }: { children: React.ReactNode, content: string }) => {
    return (
        <Tooltip>
            <TooltipTrigger className='w-full'>{children}</TooltipTrigger>
            <TooltipContent side='left' className='text-xs ml-2 font-medium bg-white text-[black] rounded-sm border'>
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    )
}

const SidebarContent = ({ open, setOpen, session, isLoading, currentPage, setCurrentPage, user, setIsOpen, logout }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, session: any, isLoading: boolean, currentPage: string, setCurrentPage: Dispatch<SetStateAction<string>>, user: any, setIsOpen: Dispatch<SetStateAction<boolean>>, logout: () => Promise<void> }) => {
    const authConext = useAuth()
    const { setUser, setIsAuth } = authConext
    const [openCreatorTools, setOpenCreatorTools] = useState(true)
    const [openAccountTools, setOpenAccountTools] = useState(true)
    const [ask, setAsk] = useState(false)

    return (
        <>
            <div className='absolute'>
                <AlertDialog open={ask} onOpenChange={setAsk}>
                    <AlertDialogTrigger></AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Each account can be linked to only one YouTube channel. Once you connect a channel, switching to another is not allowed. To analyze a different channel, You'll have to create a separate account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className='cursor-pointer' onClick={() => setAsk(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                toast.loading('Connecting...', { id: 'connect' })
                                setIsOpen(false)
                                setAsk(false)
                                signIn('google')
                            }} className='bg-[#9c3313] hover:bg-[#9c3313]/80 cursor-pointer'>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className={`lg:sticky bg-[#f3f3f3] top-0 pl-4 pr-2 left-0 h-screen overflow-hidden flex flex-col justify-between ${open ? 'w-20' : 'w-[280px] lg:w-[240px]'}`}>
                <div className='relative'>
                    <div className="flex items-center justify-between gap-2 py-3">

                        <DropdownMenu>
                            <DropdownMenuTrigger className='outline-none'>
                                <div style={{ userSelect: 'none' }} className='flex items-center p-1 rounded-sm hover:bg-[#ededed] transition-all duration-200 gap-1.5'>
                                    <img className='w-5 h-[22px] rounded-sm' src={`https://avatar.vercel.sh/${user?.fullName}`} alt="User avatar" />
                                    <span style={{ fontWeight: '600' }} className="text-[#231b1a] mt-0.5 text-sm">{user?.displayfullname ? user?.fullName : user?.first_name}</span>
                                    <ChevronDown size={13} color='#595959' />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='ml-4 w-56 border'>
                                <DropdownMenuItem onClick={async () => {
                                    logout()
                                    setUser(null)
                                    setIsAuth(false)
                                    setCurrentPage('logout')
                                    setIsOpen(false)
                                }}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    {!session ?
                        <LeftToolTip content='Connect your Youtube channel'>
                            <div className="w-full my-2">
                                <div onClick={() => {
                                    setAsk(true)
                                    setIsOpen(false)
                                }} className={`w-full cursor-pointer hover:bg-[#9c3313]/80 flex items-center gap-[5px] py-[4px] px-[6px] rounded-sm text-white font-medium text-[13px] bg-[#9c3313] transition-colors ${open ? 'px-2' : 'px-2'}`}>
                                    <Plus size={18} />
                                    {!open && <span className='mt-0.5'>Connect</span>}
                                </div>
                            </div></LeftToolTip>
                        : (
                            <LeftToolTip content='Disconnect your Youtube channel'>
                                <div className="w-full my-2">
                                    <div onClick={async () => {
                                        toast.loading('Disconnecting...', { id: 'disconnect' })

                                        try {
                                            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/disconnect-channel`, {
                                                method: 'POST',
                                                credentials: 'include',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    user_id: user._id
                                                })
                                            })
                                            const data = await res.json()
                                            if (data.success) {
                                                setIsOpen(false)
                                                await signOut()
                                                toast.success('Disconnected successfully', { id: 'disconnect' })
                                            }
                                        } catch (error) {
                                            toast.error('Failed to disconnect', { id: 'disconnect' })
                                        }
                                    }} className={`w-full cursor-pointer hover:bg-[#9c3313]/80 flex items-center gap-[5px] py-[4px] px-[6px] rounded-sm text-white font-medium text-[13px] bg-[#9c3313] transition-colors ${open ? 'px-2' : 'px-2'}`}>
                                        <LogOut size={18} />
                                        {!open && <span className='mt-0.5'>Disconnect</span>}
                                    </div>
                                </div>
                            </LeftToolTip>
                        )}
                    <nav className="flex flex-col gap-1">

                        <div className='mt-4'>
                            <LeftToolTip content='Go to Dashboard'>
                                <Link href='/dashboard' className='w-full cursor-default'>
                                    <div onClick={() => {
                                        setCurrentPage('dashboard')
                                        setIsOpen(false)
                                    }} className={`w-full  hover:text-black transition-all flex items-center gap-1.5 duration-200 px-[6px] py-[4px] hover:bg-[#ededed] text-[#484848] rounded-[4px] text-[13px] font-medium ${currentPage === 'dashboard' ? 'bg-[#ededed] text-black' : ''}`}><Home size={17} /> <p className='mt-0.5 text-[#595959]'>Dashboard</p></div>
                                </Link>
                            </LeftToolTip>
                        </div>

                        <div className='mt-3 w-full'>
                            <Accordion type="single" collapsible defaultValue="item-1">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger onClick={() => setOpenCreatorTools(!openCreatorTools)} className='w-full'>
                                        <div>
                                            <div style={{ userSelect: 'none' }} className='w-full transition-all flex items-center gap-1.5 duration-200 px-[6px] py-[4px] hover:bg-[#ededed] text-[#484848] rounded-[3px] text-xs font-medium'>Creator tools <Play size={7} color='#595959' fill='#595959' className={`${openCreatorTools ? 'rotate-90' : ''} transition-all duration-200`} /></div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='pl-1 flex flex-col gap-1'>
                                        <LeftToolTip content='Analyze your latest videos'>
                                            <Link href='/dashboard/analyze-videos' className='w-full cursor-default'>
                                                <div onClick={() => {
                                                    setCurrentPage('analyze-videos')
                                                    setIsOpen(false)
                                                }} className={`w-full  hover:text-black transition-all flex items-center gap-1.5 duration-200 px-[6px] py-[4px] hover:bg-[#ededed] text-[#484848] rounded-[4px] text-[13px] font-medium ${currentPage === 'analyze-videos' ? 'bg-[#ededed] text-black' : ''}`}><Video size={17} /> <p className='mt-0.5 text-[#595959]'>Analyze videos</p></div>
                                            </Link>
                                        </LeftToolTip>
                                        <LeftToolTip content='Make speaking more engaging'>
                                            <Link href='/dashboard/improve-my-delivery' className='w-full cursor-default'>
                                                <div onClick={() => {
                                                    setCurrentPage('improve-my-delivery')
                                                    setIsOpen(false)
                                                }} className={`w-full  hover:text-black transition-all flex items-center gap-1.5 duration-200 px-[6px] py-[4px] hover:bg-[#ededed] text-[#484848] rounded-[4px] text-[13px] font-medium ${currentPage === 'improve-my-delivery' ? 'bg-[#ededed] text-black' : ''}`}><Mic size={17} /> <p className='mt-0.5 text-[#595959]'>Improve my delivery</p></div>
                                            </Link>
                                        </LeftToolTip>
                                        <LeftToolTip content='Generate SEO friendly Metadata'>
                                            <Link href='/dashboard/caption-craft' className='w-full cursor-default'>
                                                <div className={`w-full  hover:text-black transition-all flex items-center gap-1.5 duration-200 px-[6px] py-[4px] hover:bg-[#ededed] text-[#484848] rounded-[4px] text-[13px] font-medium ${currentPage === 'caption-craft' ? 'bg-[#ededed] text-black' : ''}`}><Pen size={17} /> <p className='mt-0.5 text-[#595959]'>Caption craft</p></div>
                                            </Link>
                                        </LeftToolTip>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <div className='mt-2 w-full'>
                            <Accordion type="single" collapsible defaultValue="item-1">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger onClick={() => setOpenAccountTools(!openAccountTools)} className='w-full'>
                                        <div>
                                            <div style={{ userSelect: 'none' }} className='w-full transition-all flex items-center gap-1.5 duration-200 px-[6px] py-[4px] hover:bg-[#ededed] text-[#484848] rounded-[3px] text-xs font-medium'>Utility pages <Play size={7} color='#595959' fill='#595959' className={`${openAccountTools ? 'rotate-90' : ''} transition-all duration-200`} /></div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='pl-1 flex flex-col gap-1'>
                                        <LeftToolTip content='View pricing plans'>
                                            <Link href='/dashboard/pricing' className='w-full cursor-default'>
                                                <div onClick={() => {
                                                    setCurrentPage('pricing')
                                                    setIsOpen(false)
                                                }} className={`w-full  hover:text-black transition-all flex items-center gap-1.5 duration-200 px-[6px] py-[4px] hover:bg-[#ededed] text-[#484848] rounded-[4px] text-[13px] font-medium ${currentPage === 'pricing' ? 'bg-[#ededed] text-black' : ''}`}><DollarSign size={17} /> <p className='mt-0.5 text-[#595959]'>Pricing</p></div>
                                            </Link>
                                        </LeftToolTip>
                                        <LeftToolTip content='Manage your account settings'>
                                            <Link href='/dashboard/settings' className='w-full cursor-default'>
                                                <div onClick={() => {
                                                    setCurrentPage('settings')
                                                    setIsOpen(false)
                                                }} className={`w-full hover:text-black transition-all flex items-center gap-1.5 duration-200 px-[6px] py-[4px] hover:bg-[#ededed] text-[#484848] rounded-[4px] text-[13px] font-medium ${currentPage === 'settings' ? 'bg-[#ededed] text-black' : ''}`}><Settings size={17} /> <p className='mt-0.5 text-[#595959]'>Settings</p></div>
                                            </Link>
                                        </LeftToolTip>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>


                    </nav>
                    {/* Help & Settings */}
                    {!open && (
                        <div className="bottom-0 pb-4 px-2 fixed flex flex-col">
                            <Link href="/privacy-policy">
                                <button className="text-xs hover:underline cursor-pointer text-[#202020] text-left">Privacy Policy</button>
                            </Link>
                            <Link href="/terms-of-services">
                                <button className="text-xs hover:underline cursor-pointer text-[#202020] text-left">Terms of Services</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default function Sidebar() {
    const authConext = useAuth()
    const { user, isAuth, fetchUser, currentPage, setCurrentPage } = authConext
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { data: session } = useSession();
    const pathname = usePathname()

    useEffect(() => {
        if (!isAuth) {
            fetchUser()
        }
    }, [isAuth])

    useEffect(() => {
        setCurrentPage(pathname.split('/').pop() || '')
    }, [pathname])


    const logout = async () => {
        try {
            setIsLoading(true)
            toast.loading('Logging out...', { id: 'logout' })
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    user_id: user?._id
                })
            })
            const data = await response.json()
            if (data.success) {
                authConext.setIsAuth(false)
                authConext.setUser(null)
                toast.success('Logged out successfully', { id: 'logout' })
                signOut({ callbackUrl: '/' })
            }
        } catch (error) {
            toast.error('Failed to logout', { id: 'logout' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className='flex lg:hidden items-center p-4 justify-between'>
                <button onClick={() => {
                    setIsOpen(true)
                    setOpen(false)
                }}
                    className={`hover:bg-[#f0f0f0] flex justify-center p-1.5 rounded-md cursor-pointer transition-all duration-200`}
                >
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" data-rtl-flip="" className="icon">
                        <path d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z"></path>
                    </svg>
                </button>
                <img
                    className="w-28 mx-auto"
                    src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png"
                    alt="Pulsey Logo"
                />
            </div>
            <div className='lg:hidden absolute'>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger></SheetTrigger>
                    <SheetTitle></SheetTitle>
                    <SheetContent side='left' className='w-fit'>
                        <SidebarContent logout={logout} open={open} setOpen={setOpen} session={session} isLoading={isLoading} currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} setIsOpen={setIsOpen} />
                    </SheetContent>
                </Sheet>
            </div>

            <div className='hidden lg:block'>
                <SidebarContent logout={logout} open={open} setOpen={setOpen} session={session} isLoading={isLoading} currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} setIsOpen={setIsOpen} />
            </div>


        </>
    )
} 