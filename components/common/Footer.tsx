import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-[#5f2716] text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <Link href="/" className='flex items-center gap-2'>
                            <div className="flex py-1.5 px-2 bg-white rounded-full items-center gap-2">
                                <img
                                    src="/Images/main/Screenshot_2025-06-30_075320__1_-removebg-preview.png"
                                    alt="Pulsey"
                                    className="w-20"
                                />
                            </div>
                            <span className="text-lg font-semibold">Pulsey</span>
                        </Link>
                    </div>

                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-of-services" className="hover:text-gray-300 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20 text-center text-xs text-white/70">
                    <p>&copy; 2025 Pulsey AI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer 