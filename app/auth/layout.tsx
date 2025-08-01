import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Join Pulsey - Your AI Youtube Coach',
    description: 'Join Pulsey and grow fast in this modern era using high quality AI models.',
    icons: {
        icon: '/Images/main/Y__1_-removebg-preview.png'
    }
}

export default function AuthLayout ({ children }: { children: React.ReactNode }) {
    return (
        <div>{children}</div>
    )
}
