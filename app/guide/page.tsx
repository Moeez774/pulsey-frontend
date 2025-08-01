import Link from 'next/link'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Pulsey - Guide',
    description: 'This guide will help you understand how to use Pulsey, step-by-step, to grow your channel, get better at content delivery, and optimize for visibility and retention.',
    icons: {
        icon: '/Images/main/Y__1_-removebg-preview.png'
    }
}

const GuidePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-12 pt-36">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to Pulsey – Your YouTube Growth AI Coach
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        This guide will help you understand how to use Pulsey, step-by-step, to grow your channel,
                        get better at content delivery, and optimize for visibility and retention.
                    </p>
                </div>

                {/* Guide Sections */}
                <div className="space-y-8">
                    {/* Section 1 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Connect Your YouTube Channel</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">What it does:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Securely connect your channel via Google OAuth.</li>
                                    <li>Pulsey fetches your channel name, ID, and thumbnail.</li>
                                    <li>This helps personalize your dashboard and unlocks analysis tools.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">How to use:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Go to Dashboard.</li>
                                    <li>Click "Connect YouTube Channel."</li>
                                    <li>Sign in with your Google account and authorize access.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. View & Analyze Your Latest Videos</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">What it does:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Fetches your latest N videos from YouTube.</li>
                                    <li>Displays thumbnails, titles, and allows further analysis.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">How to use:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>After connecting your channel, your latest uploads appear.</li>
                                    <li>Click "Analyze" on any video to view deeper insights.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Analyze Any Video by URL</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">What it does:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Manually paste any YouTube video URL.</li>
                                    <li>Instantly fetches metadata and transcript for analysis.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Use case:</h3>
                                <p className="text-gray-600">Analyze competitor videos or old content not shown in recent uploads.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. AI Transcript Feedback</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">What it does:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Pulls transcript from video.</li>
                                    <li>Uses AI to give:</li>
                                    <ul className="list-disc list-inside ml-6 space-y-1">
                                        <li>3 strengths</li>
                                        <li>3 improvement areas</li>
                                        <li>Overall delivery feedback</li>
                                    </ul>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Pro tip:</h3>
                                <p className="text-gray-600">Use this before publishing to refine your script or delivery.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Title, Hook & Hashtag Generator</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">What it does:</h3>
                                <p className="text-gray-600 mb-2">Generates:</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Eye-catching Titles</li>
                                    <li>Scroll-stopping Hooks</li>
                                    <li>SEO-boosting Hashtags</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Why it matters:</h3>
                                <p className="text-gray-600">Optimizes your video for better click-through and reach.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 6 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Google Trends Integration</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">What it does:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Pulls real-time trend data from your niche.</li>
                                    <li>Suggests trending topics and keywords.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Use case:</h3>
                                <p className="text-gray-600">Use this before recording or publishing to align with what people are searching.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 7 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. YouTube Analytics Overview</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">What it does:</h3>
                                <p className="text-gray-600 mb-2">Shows key video metrics:</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Views</li>
                                    <li>Watch time</li>
                                    <li>Average view duration</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">How to use:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Navigate to Analytics tab after connecting your channel.</li>
                                    <li>Helps you track growth and performance.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 8 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Smart Summary Dashboard</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">What it does:</h3>
                                <p className="text-gray-600 mb-2">Combines all insights into one clean view.</p>
                                <p className="text-gray-600 mb-2">Includes:</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>AI feedback</li>
                                    <li>Transcript analysis</li>
                                    <li>Hooks/titles/hashtags</li>
                                    <li>Analytics summary</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Why it's powerful:</h3>
                                <p className="text-gray-600">Replaces manual tracking and lets you act on insights immediately.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 9 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Export Report as PDF</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">What it does:</h3>
                                <p className="text-gray-600">Download your entire session or dashboard insights as a PDF.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Useful for:</h3>
                                <p className="text-gray-600">Record-keeping or sharing with your team.</p>
                            </div>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tips for Best Use</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Use the Transcript Analysis feature before publishing to improve delivery.</li>
                            <li>Combine Google Trends + Title Generator for viral-ready content.</li>
                            <li>Revisit your analytics weekly to monitor improvement.</li>
                        </ul>
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

export default GuidePage 