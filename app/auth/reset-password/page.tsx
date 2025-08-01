'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordContent = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        toast.loading('Resetting password...', { id: 'reset' });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    password: formData.password
                })
            });

            const resData = await res.json();

            if (!resData.success) {
                toast.error(resData.message, { id: 'reset' });
            } else {
                toast.success('Password reset successfully', { id: 'reset' });
                router.push('/auth/sign-in');
            }
        } catch (err: any) {
            toast.error(err.message, { id: 'reset' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!token) {
        return (
            <div className="min-h-screen flex bg-white">
                <div className="w-full flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-8">
                    <div className="w-full max-w-md mx-auto flex flex-col items-center">
                        <div className="w-full flex justify-center mb-8">
                            <img src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png" alt="Pulsey Logo" className="w-32 h-auto" />
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#231b1a] mb-2 text-center">Invalid Reset Link</h1>
                            <p className='text-[#7c6f6b] text-sm mt-2 text-center'>This reset link is invalid or has expired.</p>
                        </div>
                        <button
                            onClick={() => router.push('/auth/sign-in')}
                            className="w-full cursor-pointer bg-[#9c3313] text-white py-3 rounded-full font-semibold text-base hover:bg-[#d94010] transition-colors duration-200 mt-6"
                        >
                            Back to Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white">
            <div className="w-full flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-8">
                <div className="w-full max-w-md mx-auto flex flex-col items-center">
                    <div className="w-full flex justify-center mb-8">
                        <img src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png" alt="Pulsey Logo" className="w-32 h-auto" />
                    </div>
                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#231b1a] mb-2 text-center">Reset Your Password</h1>
                        <p className='text-[#7c6f6b] text-sm mt-2 text-center'>Enter your new password below.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 mt-6">
                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white text-[#231b1a] text-base focus:ring-2 focus:ring-[#9c3313] focus:border-transparent outline-none transition-all duration-200"
                                placeholder="New Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9c3313]"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white text-[#231b1a] text-base focus:ring-2 focus:ring-[#9c3313] focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Confirm New Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9c3313]"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-[#9c3313] text-white py-3 rounded-full font-semibold text-base hover:bg-[#d94010] transition-colors duration-200 mt-2"
                        >
                            Reset Password
                        </button>
                    </form>

                    <div className="w-full flex flex-col items-center mt-6">
                        <p className="text-xs text-[#7c6f6b] text-center">
                            By continuing, you agree to our{' '}
                            <Link href="/terms" className="underline hover:text-[#9c3313]">Terms</Link> and{' '}
                            <Link href="/privacy" className="underline hover:text-[#9c3313]">Privacy Policy</Link>.
                        </p>
                        <button
                            onClick={() => router.push('/auth/sign-in')}
                            className='flex mt-4 w-full py-3 rounded-full justify-center transition-all duration-300 font-medium text-sm items-center gap-2 text-[#9c3313] cursor-pointer hover:text-[#d94010]'
                        >
                            <ArrowLeft size={18} /> Back to Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResetPassword = () => {
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
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPassword; 