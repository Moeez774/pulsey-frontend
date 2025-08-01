'use client'
import MainContent from '@/components/items/MainContent/MainContent'
import { useSession } from 'next-auth/react'
import React from 'react'

const Dashboard = () => {
    const { data: session } = useSession()
    return (
        <div className={`w-full ${!session ? 'h-screen' : ''}`}>
            <MainContent />
        </div>
    )
}

export default Dashboard