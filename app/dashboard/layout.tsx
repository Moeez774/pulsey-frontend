import Sidebar from '@/components/items/Sidebar/Sidebar'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Pulsey - Dashboard',
    description: 'Pulsey - Dashboard',
    icons: {
        icon: '/Images/main/Y__1_-removebg-preview.png'
    }
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='flex lg:flex-row flex-col w-full overflow-y-hidden'>
            <Sidebar />
            {children}
        </div>
    )
}

export default DashboardLayout