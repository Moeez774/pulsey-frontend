import Link from 'next/link'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pulsey - Privacy Policy',
    description: 'This Privacy Policy explains how we collect, use, and protect the information you provide when using our website and services.',
    icons: {
        icon: '/Images/main/Y__1_-removebg-preview.png'
    }
}

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen text-sm bg-gray-50 pb-12 pt-36">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Privacy Policy for Pulsey AI
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Effective Date: July 13, 2025
                    </p>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                        Welcome to Pulsey AI. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect the information you provide when using our website and services.
                    </p>
                </div>

                {/* Privacy Policy Sections */}
                <div className="space-y-8">
                    {/* Section 1 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Name and email address via Google OAuth login</li>
                                    <li>Profile picture (if publicly available)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">YouTube Data:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Channel ID, title, description, thumbnails</li>
                                    <li>Video IDs, titles, thumbnails, and analytics data</li>
                                    <li>Video transcripts (analyzed temporarily)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Usage Data:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li>Pages visited and interaction behavior</li>
                                    <li>Technical information such as device type and browser</li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-gray-600 italic">Note: We do not store channel or video data for more than 24 hours, unless required for active feature use.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-2">We use the collected data to:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>Analyze YouTube content for insights</li>
                                <li>Generate AI-based feedback and suggestions</li>
                                <li>Display metrics, summaries, and dashboards</li>
                                <li>Improve our features and services</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Share Your Information</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                We do not sell or share your personal or YouTube data with third parties. Your data is only used internally to power the Pulsey AI platform.
                            </p>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
                        <div className="space-y-4">
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>User-generated content is automatically deleted after 24 hours unless it's being actively processed. We do not retain any YouTube channel or video data beyond 24 hours unless required for ongoing analysis.</li>
                                <li>OAuth tokens are refreshed and stored securely during user sessions only</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Security</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                We use industry-standard encryption and secure authentication to protect your information.
                            </p>
                        </div>
                    </div>

                    {/* Section 6 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Choices</h2>
                        <div className="space-y-4">
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>You may disconnect your YouTube channel at any time</li>
                                <li>You can delete your Pulsey account by contacting support</li>
                                <li>You can revoke Pulsey AI's access to your Google account anytime by visiting your <Link href="https://myaccount.google.com/connections?filters=3,4&hl=en-GB" target="_blank" className="text-blue-500 hover:underline">Google Account Permissions</Link>. If you'd like us to delete your account, contact us at moeezurrehman33@gmail.com</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 7 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party APIs</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                            Pulsey AI uses the YouTube Data and Analytics APIs in accordance with Google's API Services User Data Policy. We fully comply with Google's data practices — you can learn more in the <Link href="https://policies.google.com/privacy" target="_blank" className="text-blue-500 hover:underline">Google Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">Pulsey AI uses cookies and similar technologies to store session tokens, track usage behavior, and improve your experience. You can disable cookies through your browser settings.</p>
                        </div>
                    </div>

                    {/* Section 8 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                We may update this Privacy Policy. Any changes will be reflected on this page with an updated date.
                            </p>
                        </div>
                    </div>

                    {/* Section 9 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-2">If you have questions about this Privacy Policy, please contact us at:</p>
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

export default PrivacyPolicyPage 