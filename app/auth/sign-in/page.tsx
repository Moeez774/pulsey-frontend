'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const SignInContent = () => {
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams()
    const page = searchParams?.get("page") ? searchParams?.get("page") : ""
    const redirect = searchParams?.get("redirect") ? searchParams?.get("redirect") : ""
    const videoUrl = searchParams?.get("videoUrl") ? searchParams?.get("videoUrl") : ""
    const videoDescription = searchParams?.get("videoDescription") ? searchParams?.get("videoDescription") : ""
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const router = useRouter()
    const [toggleReset, setToggleReset] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading('Signing in...', { id: 'signin' })

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })

            const resData = await res.json();

            if (!resData.success) {
                toast.error(resData.message, { id: 'signin' });
            } else {
                const response = await fetch('/api/signin', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                })
                const data = await response.json();
                if (!data.success) {
                    toast.error(data.message, { id: 'signin' });
                } else {
                    toast.success('Signed in successfully', { id: 'signin' });
                    if (redirect && videoUrl && videoDescription) {
                        router.push(`${redirect}?videoUrl=${videoUrl}&videoDescription=${videoDescription}`)
                    } else {
                        router.push('/dashboard');
                    }
                }
            }
        } catch (err: any) {
            toast.error(err.message, { id: 'signin' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const sendResetEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading('Sending reset email...', { id: 'signin' })
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/send-reset-password-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email
                })
            })
            const resData = await res.json();
            if (!resData.success) {
                toast.error(resData.message, { id: 'signin' });
            } else {
                toast.success(resData.message, { id: 'signin' });
            }
        } catch (err: any) {
            toast.error(err.message, { id: 'signin' });
        }
    }

    useEffect(() => {
        if (page === "reset-password") {
            setToggleReset(true)
        }
    }, [page])

    return (
        <div className="min-h-screen flex bg-white">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-8 relative">

                <div className="w-full max-w-md mx-auto flex flex-col items-center">
                    <div className="w-full flex justify-center mb-8">
                        <img src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png" alt="Pulsey Logo" className="w-32 h-auto" />
                    </div>
                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#231b1a] mb-2 text-center">{toggleReset ? "Don't worry! We've got you." : "Welcome back"}</h1>

                        {toggleReset && <p className='text-[#7c6f6b] text-sm mt-2'>Just provide your email and we'll try our best to help you.</p>}
                    </div>
                    <form onSubmit={toggleReset ? sendResetEmail : handleSubmit} className="w-full flex flex-col gap-5 mt-6">
                        {/* Email Field */}
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white text-[#231b1a] text-base focus:ring-2 focus:ring-[#9c3313] focus:border-transparent outline-none transition-all duration-200"
                            placeholder="Enter your email"
                        />
                        {/* Password Field */}
                        {!toggleReset && <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white text-[#231b1a] text-base focus:ring-2 focus:ring-[#9c3313] focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9c3313]"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>}
                        {!toggleReset && (
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        email: '',
                                        password: ''
                                    })
                                    router.push(`/auth/sign-in?page=reset-password&redirect=${redirect}&videoUrl=${videoUrl}&videoDescription=${videoDescription}`)
                                    setToggleReset(true)
                                }}
                                className='underline text-[#9c3313] cursor-pointer hover:text-[#d94010] -mt-2 font-medium text-xs ml-2 text-left w-fit'
                                style={{ alignSelf: 'flex-start' }}
                            >
                                Forgot Password?
                            </button>
                        )}
                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-[#9c3313] text-white py-3 rounded-full font-semibold text-base hover:bg-[#d94010] transition-colors duration-200 mt-2"
                        >
                            Continue
                        </button>
                    </form>
                    {!toggleReset && <div className="w-full flex flex-col items-center mt-6">
                        <p className="text-xs text-[#7c6f6b] text-center">
                            By continuing, you agree to our{' '}
                            <Link href="/terms-of-services" className="underline hover:text-[#9c3313]">Terms</Link> and{' '}
                            <Link href="/privacy-policy" className="underline hover:text-[#9c3313]">Privacy Policy</Link>.
                        </p>
                        <p className="text-sm text-[#231b1a] mt-4">
                            Don't have an account?{' '}
                            <Link href={`/auth/sign-up?redirect=${redirect}&videoUrl=${videoUrl}&videoDescription=${videoDescription}`} className="text-[#9c3313] cursor-pointer hover:text-[#d94010] font-medium transition-colors">Sign up</Link>
                        </p>
                    </div>}

                    {toggleReset && (
                        <button onClick={() => {
                            setFormData({
                                email: '',
                                password: ''
                            })
                            router.push(`/auth/sign-in?redirect=${redirect}&videoUrl=${videoUrl}&videoDescription=${videoDescription}`)
                            setToggleReset(false)
                        }} className='flex mt-4 w-full py-3 rounded-full justify-center transition-all duration-300 font-medium text-sm items-center gap-2 text-[#9c3313] cursor-pointer hover:text-[#d94010]'><ArrowLeft size={18} /> Go Back</button>
                    )}
                </div>
            </div>
            {/* Right Side - Sticky Image */}
            <div className="hidden md:block md:w-1/2 h-screen sticky top-0 right-0 overflow-hidden">
                <img
                    src="/Images/main/freepik__the-style-is-candid-image-photography-with-natural__26987.jpeg"
                    alt="Sign In Visual"
                    className="w-full h-full object-cover object-center"
                />
            </div>
        </div>
    );
};

const SignIn = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex bg-white">
                <div className="w-full flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-8">
                    <div className="w-full max-w-md mx-auto flex flex-col items-center">
                        <div className="w-full flex justify-center mb-8">
                            <img src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png" alt="Pulsey Logo" className="w-32 h-auto" />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <h1 className="text-[#231b1a] mb-2 text-center">Loading...</h1>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <SignInContent />
        </Suspense>
    );
};

export default SignIn; 