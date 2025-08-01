'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const SignUpContent = () => {
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams()
    const redirect = searchParams?.get("redirect") ? searchParams?.get("redirect") : ""
    const videoUrl = searchParams?.get("videoUrl") ? searchParams?.get("videoUrl") : ""
    const videoDescription = searchParams?.get("videoDescription") ? searchParams?.get("videoDescription") : ""
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        toast.loading('Creating account...', { id: 'signup' })

        const uid = uuidv4()
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    confirmPassword: formData.confirmPassword,
                    uid: uid
                })
            });
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message, { id: 'signup' });
            } else {
                toast.success(data.message, { id: 'signup' });
                router.push(`/auth/sign-in?redirect=${redirect}&videoUrl=${videoUrl}&videoDescription=${videoDescription}`);
            }
        } catch (err: any) {
            toast.error(err.message, { id: 'signup' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex bg-white">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-12 relative">
                <div className="w-full max-w-md mx-auto flex flex-col items-center">
                    <div className="w-full flex justify-center mb-8">
                        <img src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png" alt="Pulsey Logo" className="w-32 h-auto" />
                    </div>
                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#231b1a] mb-2 text-center">Create your account</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white text-[#231b1a] text-base focus:ring-2 focus:ring-[#9c3313] focus:border-transparent outline-none transition-all duration-200"
                                placeholder="First name"
                            />
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white text-[#231b1a] text-base focus:ring-2 focus:ring-[#9c3313] focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Last name"
                            />
                        </div>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white text-[#231b1a] text-base focus:ring-2 focus:ring-[#9c3313] focus:border-transparent outline-none transition-all duration-200"
                            placeholder="Full name"
                        />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white text-[#231b1a] text-base focus:ring-2 focus:ring-[#9c3313] focus:border-transparent outline-none transition-all duration-200"
                            placeholder="Email address"
                        />
                        {/* Password Fields */}
                        <div className="relative">
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
                                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9c3313]"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white text-[#231b1a] text-base focus:ring-2 focus:ring-[#9c3313] focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Confirm password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9c3313]"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-[#9c3313] text-white py-3 rounded-full font-semibold text-base hover:bg-[#d94010] transition-colors duration-200 mt-2"
                        >
                            Create Account
                        </button>
                    </form>
                    <div className="w-full flex flex-col items-center mt-6">
                        <p className="text-sm text-[#231b1a] mt-2">
                            Already have an account?{' '}
                            <Link href={`/auth/sign-in?redirect=${redirect}&videoUrl=${videoUrl}&videoDescription=${videoDescription}`} className="text-[#9c3313] cursor-pointer hover:text-[#d94010] font-medium transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* Right Side - Sticky Image */}
            <div className="hidden md:block md:w-1/2 h-screen sticky top-0 right-0 overflow-hidden">
                <img
                    src="/Images/main/freepik__the-style-is-candid-image-photography-with-natural__26988.jpeg"
                    alt="Sign Up Visual"
                    className="w-full h-full object-cover object-center"
                />
            </div>
        </div>
    );
};

const SignUp = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex bg-white">
                <div className="w-full flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-8">
                    <div className="w-full max-w-md mx-auto flex flex-col items-center">
                        <div className="w-full flex justify-center mb-8">
                            <img src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png" alt="Pulsey Logo" className="w-32 h-auto" />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#231b1a] mb-2 text-center">Loading...</h1>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <SignUpContent />
        </Suspense>
    );
};

export default SignUp; 