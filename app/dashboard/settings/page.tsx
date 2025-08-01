'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Trash2 } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useAuth } from '@/context/AuthProvider'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SettingsPage = () => {
    const { data: session } = useSession()
    const { user } = useAuth()
    const [fullName, setFullName] = useState(user?.fullName || '')
    const [firstName, setFirstName] = useState(user?.first_name || '')
    const [lastName, setLastName] = useState(user?.last_name || '')
    const [displayFullNames, setDisplayFullNames] = useState(false)
    const [aiMemoryEnabled, setAiMemoryEnabled] = useState(true)
    const [oldPassword, setOldPassword] = useState('')
    const [delete_ai_memory, setDeleteAiMemory] = useState(false)
    const [is_password_changed, setIsPasswordChanged] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [ask, setAsk] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (is_password_changed) {
            if (newPassword !== confirmPassword) {
                toast.error('New password and confirm password do not match', { id: 'updating' })
                return
            }
        }
        toast.loading('Updating account...', { id: 'updating' })

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user?._id,
                    fullName,
                    first_name: firstName,
                    last_name: lastName,
                    displayfullname: displayFullNames,
                    old_password: oldPassword,
                    new_password: is_password_changed ? newPassword : oldPassword,
                    allow_remembering: aiMemoryEnabled,
                    delete_ai_memory: delete_ai_memory,
                    is_password_changed: is_password_changed
                })
            })

            const data = await res.json()
            if (data.success) {
                toast.success('Account updated successfully', { id: 'updating' })
                window.location.reload()
                setIsPasswordChanged(false)
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
            } else {
                toast.error(data.message || 'Failed to update account', { id: 'updating' })
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update account', { id: 'updating' })
        }
    }

    const handleDeleteAiMemory = () => {
        setDeleteAiMemory(!delete_ai_memory)
    }

    useEffect(() => {
        setFullName(user?.fullName || '')
        setFirstName(user?.first_name || '')
        setDisplayFullNames(user?.displayfullname || false)
        setLastName(user?.last_name || '')
        setAiMemoryEnabled(user?.allow_remembering || false)
    }, [user])

    useEffect(() => {
        if (oldPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0) {
            setIsPasswordChanged(true)
        } else {
            setIsPasswordChanged(false)
        }
    }, [oldPassword, newPassword, confirmPassword])

    const handleDisconnectChannel = async () => {
        toast.loading('Disconnecting...', { id: 'disconnect' })

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/switch-channel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user?._id,
                })
            })

            const data = await res.json()
            if (data.success) {
                toast.success(data.message, { id: 'disconnect' })
                await signOut()
            } else {
                toast.error(data.message || 'Failed to switch channel', { id: 'disconnect' })
            }
        } catch (err) {
            toast.error('Failed to disconnect channel', { id: 'disconnect' })
        }
    }

    return (
        <>
            <AlertDialog open={ask} onOpenChange={setAsk}>
                <AlertDialogTrigger></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Warning</AlertDialogTitle>
                        <AlertDialogDescription>
                            {user?.is_connected ? 'Disconnecting your channel will erase all associated data and preferences. A fresh start will begin with your newly connected channel. Are you sure you want to proceed?' : "Each account can be linked to only one YouTube channel. Once you connect a channel, switching to another will cause you to lose all your data and preferences for the current channel."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer' onClick={() => setAsk(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (user?.is_connected) {
                                setAsk(false)
                                handleDisconnectChannel()
                            } else {
                                toast.loading('Connecting...', { id: 'connect' })
                                setAsk(false)
                                signIn('google')
                            }
                        }} className='bg-[#9c3313] hover:bg-[#9c3313]/80 cursor-pointer'>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <section className="flex flex-col bg-[#f3f3f3] items-center w-full h-full lg:h-screen justify-start sm:p-2 relative">
                <div className="w-full max-w-7xl mx-auto bg-white overflow-y-auto h-full sm:rounded-sm border-t sm:border md:p-8 px-6 py-8 relative" style={{ scrollbarWidth: 'thin' }}>
                    <div className='flex mb-8 xl:flex-row flex-col gap-4 justify-between xl:items-center'>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#231b1a] mb-1">Settings</h2>
                            <p className="text-[#7c6f6b]">Manage your account preferences and data</p>
                        </div>
                    </div>

                    <form onSubmit={handleSaveProfile} className="pt-6 sm:pt-10 max-w-2xl mx-auto w-full pb-6 sm:pb-10 px-4 sm:px-0">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-base sm:text-[17px] font-semibold text-[#595959]">Profile</h3>
                        </div>
                        <div className="max-w-2xl mb-12 sm:mb-16 mx-auto w-full border border-[#cfcfcf] bg-white rounded-md p-4 sm:p-6">
                            {/* Profile Section */}
                            <div className="mb-8">

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="fullName" className="text-sm font-medium text-[#231b1a]">
                                            Full Name
                                        </Label>
                                        <p className="text-xs text-[#7c6f6b] mb-2">Your complete name as it appears on your account</p>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="border-[#cfcfcf] focus:border-[#9c3313] focus:ring-[#9c3313]/20"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName" className="text-sm font-medium text-[#231b1a]">
                                                First Name
                                            </Label>
                                            <p className="text-xs text-[#7c6f6b] mb-2">Your first name</p>
                                            <Input
                                                id="firstName"
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="border-[#cfcfcf] focus:border-[#9c3313] focus:ring-[#9c3313]/20"
                                                placeholder="First name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName" className="text-sm font-medium text-[#231b1a]">
                                                Last Name
                                            </Label>
                                            <p className="text-xs text-[#7c6f6b] mb-2">Your last name</p>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="border-[#cfcfcf] focus:border-[#9c3313] focus:ring-[#9c3313]/20"
                                                placeholder="Last name"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 sm:gap-0">
                                        <div>
                                            <Label htmlFor="displayNames" className="text-sm font-medium text-[#231b1a]">
                                                Display full name
                                            </Label>
                                            <p className="text-xs text-[#7c6f6b]">Show full name instead of first name only</p>
                                        </div>
                                        <Switch
                                            id="displayNames"
                                            checked={displayFullNames}
                                            onCheckedChange={setDisplayFullNames}
                                            className="data-[state=checked]:bg-[#9c3313]"
                                        />
                                    </div>

                                    {/* Change Password Subsection */}
                                    <div className="border-t border-[#f0f0f0] pt-6 mt-6">
                                        <h4 className="text-sm font-medium text-[#231b1a] mb-4">Change Password</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="currentPassword" className="text-sm font-medium text-[#231b1a]">
                                                    Current Password
                                                </Label>
                                                <p className="text-xs text-[#7c6f6b] mb-2">Enter your current password to verify your identity</p>
                                                <Input
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    id="currentPassword"
                                                    type="password"
                                                    className="border-[#cfcfcf] focus:border-[#9c3313] focus:ring-[#9c3313]/20"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="newPassword" className="text-sm font-medium text-[#231b1a]">
                                                    New Password
                                                </Label>
                                                <p className="text-xs text-[#7c6f6b] mb-2">Enter your new password</p>
                                                <Input
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    id="newPassword"
                                                    type="password"
                                                    className="border-[#cfcfcf] focus:border-[#9c3313] focus:ring-[#9c3313]/20"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#231b1a]">
                                                    Confirm New Password
                                                </Label>
                                                <p className="text-xs text-[#7c6f6b] mb-2">Re-enter your new password to confirm</p>
                                                <Input
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    id="confirmPassword"
                                                    type="password"
                                                    className="border-[#cfcfcf] focus:border-[#9c3313] focus:ring-[#9c3313]/20"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mb-12 sm:mb-16'>
                            {/* Connected Accounts Section */}
                            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-[17px] font-semibold text-[#595959]">Switch Channel</h3>
                            </div>
                            <div className="mb-8 border border-[#cfcfcf] p-3 sm:p-4 rounded-md bg-white">

                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 sm:gap-0">
                                        <div>
                                            <Label className="text-sm font-medium text-[#231b1a]">
                                                YouTube Channel
                                            </Label>
                                            <p className="text-xs text-[#7c6f6b]">Switch your YouTube channel</p>
                                        </div>
                                        <button
                                            type='button'
                                            onClick={async () => {
                                                setAsk(true)
                                            }}
                                            className='text-xs w-full sm:w-fit justify-center font-medium px-4 rounded-sm border-[#cfcfcf] py-[10px] sm:py-[7px] border shadow-sm hover:bg-[#f0f0f0] transition-all duration-200 flex items-center gap-2'
                                        >
                                            {user?.is_connected ? 'Disconnect' : 'Connect'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mb-12 sm:mb-16'>
                            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-[17px] font-semibold text-[#595959]">AI Memory</h3>
                            </div>
                            {/* AI Memory Section */}
                            <div className="mb-8 border border-[#cfcfcf] p-3 sm:p-4 rounded-md bg-white">

                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 sm:gap-0">
                                        <div>
                                            <Label htmlFor="aiMemory" className="text-sm font-medium text-[#231b1a]">
                                                AI Memory
                                            </Label>
                                            <p className="text-xs text-[#7c6f6b]">Allow AI to remember your preferences and past interactions</p>
                                        </div>
                                        <Switch
                                            id="aiMemory"
                                            checked={aiMemoryEnabled}
                                            onCheckedChange={setAiMemoryEnabled}
                                            className="data-[state=checked]:bg-[#9c3313]"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3 sm:gap-0">
                                        <div>
                                            <Label className="text-sm font-medium text-[#231b1a]">
                                                Delete AI Memory
                                            </Label>
                                            <p className="text-xs text-[#7c6f6b]">Permanently delete all saved AI prompting data and preferences</p>
                                        </div>
                                        <button
                                            type='button'
                                            onClick={handleDeleteAiMemory}
                                            className={`text-[13px] w-full sm:w-fit justify-center font-medium px-3 rounded-sm border-[#cfcfcf] py-[10px] sm:py-[7px] border shadow-sm transition-all duration-200 flex items-center gap-2 ${delete_ai_memory ? 'bg-red-600 text-white hover:bg-red-600/80' : 'text-red-600 hover:bg-[#f0f0f0]'}`}
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    type='submit'
                                    className='text-xs font-medium px-4 bg-[#9c3313] justify-center text-white rounded-sm py-[10px] hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 flex items-center gap-2 w-full sm:w-fit'
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

export default SettingsPage 