'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const VerifyEmailContent = () => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [verificationResult, setVerificationResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const searchParams = useSearchParams()

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setVerificationResult({
                    success: false,
                    message: 'Verification token is missing. Please check your email and try again.'
                });
                setIsVerifying(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/verify-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();

                if (data.success) {
                    setVerificationResult({
                        success: true,
                        message: data.message || 'Email verified successfully! You can now sign in to your account.'
                    });
                    toast.success('Email verified successfully!', { id: 'verify-email' });
                } else {
                    setVerificationResult({
                        success: false,
                        message: data.message || 'Email verification failed. Please try again or contact support.'
                    });
                    toast.error(data.message || 'Verification failed', { id: 'verify-email' });
                }
            } catch (error: any) {
                setVerificationResult({
                    success: false,
                    message: 'Something went wrong. Please try again later.'
                });
                toast.error('Verification failed', { id: 'verify-email' });
            } finally {
                setIsVerifying(false);
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex bg-white">
            <div className="w-full flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-8 relative">
                <div className="w-full max-w-md mx-auto flex flex-col items-center">
                    <div className="w-full flex justify-center mb-8">
                        <img src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png" alt="Pulsey Logo" className="w-32 h-auto" />
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#231b1a] mb-2 text-center">
                            Email Verification
                        </h1>
                    </div>

                    {/* Verification Card */}
                    <div className="w-full bg-white rounded-xl border border-gray-200 p-8 mt-6 shadow-sm">
                        {isVerifying ? (
                            // Loading State
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="loader"></div>
                                <p className="text-[#7c6f6b] text-sm mt-10 text-center">
                                    Verifying your email address...
                                </p>
                            </div>
                        ) : verificationResult ? (
                            // Result State
                            <div className="flex flex-col items-center justify-center py-8">
                                {verificationResult.success ? (
                                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                ) : (
                                    <XCircle className="w-16 h-16 text-red-500 mb-4" />
                                )}

                                <h2 className={`text-xl font-semibold mb-3 text-center ${verificationResult.success ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {verificationResult.success ? 'Verification Successful!' : 'Verification Failed'}
                                </h2>

                                <p className="text-[#7c6f6b] text-sm text-center mb-6">
                                    {verificationResult.message}
                                </p>

                                <div className="flex flex-col gap-3 w-full">
                                    {verificationResult.success ? (
                                        <Link
                                            href="/auth/sign-in"
                                            className="w-full cursor-pointer bg-[#9c3313] text-white py-3 rounded-full font-semibold text-base hover:bg-[#d94010] transition-colors duration-200 text-center"
                                        >
                                            Sign In Now
                                        </Link>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="w-full cursor-pointer bg-[#9c3313] text-white py-3 rounded-full font-semibold text-base hover:bg-[#d94010] transition-colors duration-200"
                                            >
                                                Try Again
                                            </button>
                                            <Link
                                                href="/auth/sign-in"
                                                className="w-full cursor-pointer border border-[#9c3313] text-[#9c3313] py-3 rounded-full font-semibold text-base hover:bg-[#9c3313] hover:text-white transition-colors duration-200 text-center"
                                            >
                                                Back to Sign In
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Back to Sign In Link */}
                    <div className="w-full flex justify-center mt-6">
                        <Link
                            href="/auth/sign-in"
                            className="flex items-center gap-2 text-[#9c3313] cursor-pointer hover:text-[#d94010] font-medium transition-colors text-sm"
                        >
                            <ArrowLeft size={16} />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VerifyEmail = () => {
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
            <VerifyEmailContent />
        </Suspense>
    );
};

export default VerifyEmail; 