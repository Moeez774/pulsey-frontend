'use client'
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

type AuthContextType = {
    user: any;
    setUser: (user: any) => void;
    isAuth: boolean;
    setIsAuth: (isAuth: boolean) => void;
    fetchUser: () => Promise<void>;
    channelData: ChannelDetails | null;
    analytics: AnalyticsData | null;
    analyticsLoading: boolean;
    isLoading: boolean;
    error: string;
    currentPage: string;
    setCurrentPage: Dispatch<SetStateAction<string>>;
};

interface ChannelDetails {
    id: string;
    name: string;
    description: string;
    profileImage: string;
    bannerImage: string;
    subscribers: string;
    totalViews: string;
    videoCount: string;
}

interface ColumnHeader {
    name: string;
    columnType: string;
    dataType: string;
}

interface AnalyticsData {
    kind: string;
    columnHeaders: ColumnHeader[];
    rows: any[][];
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    isAuth: false,
    setIsAuth: () => { },
    fetchUser: async () => { },
    channelData: null,
    analytics: null,
    analyticsLoading: false,
    isLoading: false,
    error: '',
    currentPage: 'Dashboard',
    setCurrentPage: () => { }
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null)
    const [isAuth, setIsAuth] = useState(false)
    const { data: session } = useSession();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [channelData, setChannelData] = useState<ChannelDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('')
    const [currentPage, setCurrentPage] = useState('Dashboard')
    const ideas_Fetched = useRef(false)
    const channel_data_fetched = useRef(false)
    const analytics_fetched = useRef(false)

    const fetchAnalytics = async () => {
        if (!session?.accessToken || analytics_fetched.current) return;

        setAnalyticsLoading(true);
        analytics_fetched.current = true;

        try {

            const response = await fetch("/api/analytics", {
                headers: {
                    Authorization: `Bearer ${session.accessToken as string}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch analytics');
            }

            const data = await response.json();

            setAnalytics(data);
        } catch (err: any) {
            setAnalytics(null);
            analytics_fetched.current = false;
        } finally {
            setAnalyticsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.accessToken && !analytics_fetched.current) {
            setAnalyticsLoading(false);
            fetchAnalytics();
        }
    }, [session])

    const fetchChannelDetails = async () => {
        setIsLoading(true);
        setError('');

        try {

            if (new Date(user.channel_data_fetched_at) && new Date(user.channel_data_fetched_at) > new Date(Date.now() - 1000 * 60 * 60 * 24)) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/get-channel-data?user_id=${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch channel details');
                }

                const data = await response.json();
                if (data.success) {
                    setChannelData(data.channel_data);
                }
                return;
            }
            else {
                const response = await fetch('/api/channel-details', {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken as string}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch channel details');
                }

                const data = await response.json();
                setChannelData(data);

                const saveInDB = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/save-channel-data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: data, user_id: user._id })
                })

                if (!saveInDB.ok) {
                    const errorData = await saveInDB.json();
                    throw new Error(errorData.error || 'Failed to save channel data');
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.accessToken && user && !channel_data_fetched.current) {
            channel_data_fetched.current = true;
            fetchChannelDetails();
        }
    }, [session?.accessToken, user]);

    const fetchUser = async () => {
        try {
            const token = Cookies.get('pulsey-auth-token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.success) {
                setUser(data.user)
                setIsAuth(true)
            }
        } catch (error) {
            console.log(error)
            setIsAuth(false)
            setUser(null)
        }
    }

    useEffect(() => {
        if (!user || !user.niche || !channelData) return;

        if (user.connected_channel_id && user.connected_channel_id != channelData.id) {
            toast.error('You cannot connect more then one channel per account.', { id: 'disconnect' })
            signOut()
            return;
        }

        if (ideas_Fetched.current) return;

        if (
            (new Date(user.ideas_suggested_at) &&
                new Date(user.ideas_suggested_at) > new Date(Date.now() - 24 * 60 * 60 * 1000))
        ) {
            return;
        }

        ideas_Fetched.current = true;

        const fetchTrends = async () => {
            try {
                const getToQueries = await fetch(`/api/trends?keyword=${user?.niche?.join(',')}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                })

                if (!getToQueries.ok) {
                    console.log('Error fetching trends:', getToQueries.statusText);
                    return;
                }

                const queries = await getToQueries.json();
                if (!queries.success) return;

                let top_queries = "";
                let rising_queries = "";

                queries.queries.forEach((query: any) => {
                    if (query.data.related_queries.top.length > 0) {
                        top_queries += query.data.related_queries.top;
                    }
                    if (query.data.related_queries.rising.length > 0) {
                        rising_queries += query.data.related_queries.rising;
                    }
                });

                const token = Cookies.get('pulsey-auth-token')
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/suggest-ideas`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        channel_data: channelData,
                        top_queries,
                        rising_queries
                    })
                });

                const data = await response.json();
                console.log('Ideas fetched:', data);

            } catch (error) {
                console.error('Error fetching trends:', error);
            }
        };

        fetchTrends();
    }, [user, channelData]);


    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, isAuth, setIsAuth, fetchUser, channelData, analytics, analyticsLoading, isLoading, error, currentPage, setCurrentPage }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;