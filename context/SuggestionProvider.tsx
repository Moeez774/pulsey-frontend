import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSession } from "next-auth/react";

export const SuggestionContext = createContext({
    niche: [] as string[],
    setNiche: (niche: string[]) => { },
    fetchNiche: () => { },
    videosData: {} as any,
    setVideosData: (videosData: any) => { },
    isLoading: false,
    setIsLoading: (isLoading: boolean) => { },
    error: '',
    setError: (error: string) => { },
    refreshVideos: () => { }
})

export const SuggestionProvider = ({ children }: { children: React.ReactNode }) => {
    const [niche, setNiche] = useState<string[]>([])
    const [videosData, setVideosData] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasFetchedVideos, setHasFetchedVideos] = useState(false);
    const authContext = useAuth()
    const user = authContext?.user
    const channelData = authContext?.channelData
    const { data: session } = useSession();
    const niche_fetched = useRef(false)
    const videos_fetched = useRef(false)

    const fetchNiche = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/set-niche`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channel_data: channelData,
                    user_id: user._id
                })
            })

            const data = await response.json()

            if (data.success) {
                setNiche(data.niches)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!user || !channelData || niche_fetched.current) return

        if (!user.niche || user.niche.length === 0) {
            fetchNiche()
            niche_fetched.current = true
        }
    }, [user, channelData])

    const fetchVideos = async () => {
        if (!session?.accessToken || hasFetchedVideos) return;

        setIsLoading(true);
        setError('');

        try {

            if (new Date(user.videos_fetched_at) && new Date(user.videos_fetched_at) > new Date(Date.now() - 1000 * 60 * 60 * 24)) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/videos/get-videos?user_id=${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch videos');
                }

                const data = await response.json();
                if (data.success) {
                    setVideosData(data.videos);
                    setHasFetchedVideos(true);
                }
                return;
            }
            else {
                const response = await fetch('/api/get-n-videos?dev=true', {
                    headers: {
                        Authorization: `Bearer ${session.accessToken as string}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch videos');
                }

                const data = await response.json();
                setVideosData(data);
                setHasFetchedVideos(true);

                const saveInDB = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/videos/save-videos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: data, user_id: user._id })
                })

                if (!saveInDB.ok) {
                    const errorData = await saveInDB.json();
                    throw new Error(errorData.error || 'Failed to save videos');
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshVideos = async () => {
        setHasFetchedVideos(false);
        await fetchVideos();
    };

    useEffect(() => {
        if (session?.accessToken && user && !videos_fetched.current) {
            videos_fetched.current = true
            fetchVideos()
        }
    }, [session?.accessToken, user, videos_fetched.current])

    return (
        <SuggestionContext.Provider value={{
            niche,
            setNiche,
            fetchNiche,
            videosData,
            setVideosData,
            isLoading,
            setIsLoading,
            error,
            setError,
            refreshVideos
        }}>
            {children}
        </SuggestionContext.Provider>
    )
}

export const useSuggestion = () => useContext(SuggestionContext);
export default SuggestionProvider;
