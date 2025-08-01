'use client'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold'>Pricing will be announced soon</h1>
        <p className='text-sm mt-2 text-gray-500'>Till then enjoy Pulsey free for 14 days</p>
        <Link href="/auth/sign-in">
            <button className='bg-[#9c3313] mt-4 hover:bg-[#9c3313]/80 cursor-pointer transition-all duration-300 text-white text-sm font-medium px-4 py-[8px] rounded-sm'>Get Started</button>
        </Link>
    </div>
  )
}

export default page