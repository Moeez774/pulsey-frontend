import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const cookieStore = await cookies()
    const { user_id } = await request.json()

    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/disconnect-channel`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id
            })
        })

        const data = await res.json()
        if (data.success) {
            cookieStore.delete('pulsey-auth-token')
            return NextResponse.json({ message: 'Logged out successfully', success: true })
        }

        return NextResponse.json({ message: 'Failed to Logout, Please try again.', success: false })
    } catch (err) {
        return NextResponse.json({ message: "Error in logging out, Please try again.", success: false })
    }
}