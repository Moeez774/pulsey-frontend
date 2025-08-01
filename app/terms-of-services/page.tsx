import Link from 'next/link'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pulsey - Terms of Service',
    description: 'These Terms of Service govern your access and use of our platform at https://pulsey-ai.vercel.app.',
    icons: {
        icon: '/Images/main/Y__1_-removebg-preview.png'
    }
}

const TermsOfServicePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-12 pt-36">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Terms of Service for Pulsey AI
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Effective Date: July 15, 2025
                    </p>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                        Welcome to Pulsey AI. These Terms of Service govern your access and use of our platform at https://pulsey-ai.vercel.app.
                    </p>
                </div>

                {/* Terms of Service Sections */}
                <div className="space-y-8">
                    {/* Section 1 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                By using Pulsey AI, you agree to be bound by these terms. If you do not agree, please do not use the service.
                            </p>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of the Service</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-2">You agree to:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>Use the platform only for lawful purposes</li>
                                <li>Not attempt to reverse-engineer or exploit our AI or platform</li>
                                <li>Not abuse the YouTube Data API access provided by Pulsey AI</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. YouTube Channel Access</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                            By connecting your YouTube account, you authorize Pulsey AI to access limited data required for video analysis. You may disconnect at any time. By using Pulsey AI, you also agree to the <Link href="https://www.youtube.com/t/terms" target="_blank" className="text-blue-500 hover:underline">YouTube Terms of Service</Link>.
                            </p>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Account Security</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                You are responsible for maintaining the confidentiality of your login credentials.
                            </p>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                All original content, features, and tools on Pulsey AI are owned by Pulsey. You may not replicate, copy, or sell any part of the service.
                            </p>
                        </div>
                    </div>

                    {/* Section 6 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Pulsey AI provides insights and analysis tools. We are not liable for any actions taken by users based on those insights.
                            </p>
                        </div>
                    </div>

                    {/* Section 7 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                We reserve the right to suspend or terminate accounts that violate our policies.
                            </p>
                        </div>
                    </div>

                    {/* Section 8 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Modifications</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                We may modify these terms at any time. Continued use of Pulsey AI after changes implies acceptance.
                            </p>
                        </div>
                    </div>

                    {/* Section 9 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600 font-medium">Email: moeezurrehman33@gmail.com</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <Link href="/auth/sign-in"><button
                        className="inline-block bg-[#9c3313] cursor-pointer text-white px-8 py-3 rounded-lg font-medium hover:bg-[#9c3313]/80 transition-colors"
                    >
                        Get Started with Pulsey
                    </button></Link>
                </div>
            </div>
        </div>
    )
}

export default TermsOfServicePage 