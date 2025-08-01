import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react'
import { MdAutoAwesome } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useInView } from 'react-intersection-observer';
import { FaSearch } from 'react-icons/fa';
import { Info } from 'lucide-react';
import AIResponse from '@/components/common/AIResponse';
import TypeWriter from '@/components/common/TypeWriter';

export const extractYouTubeVideoId = (url: string): string | null => {
    const parsedUrl = new URL(url);
    const videoId = parsedUrl.searchParams.get("v");
    return videoId;
}

export interface TranscriptionResponse {
    metadata: {
        kind: string;
        etag: string;
        items: Array<{
            kind: string;
            etag: string;
            id: string;
            snippet: {
                videoId: string;
                lastUpdated: string;
                trackKind: string;
                language: string;
                name: string;
                audioTrackType: string;
                isCC: boolean;
                isLarge: boolean;
                isEasyReader: boolean;
                isDraft: boolean;
                isAutoSynced: boolean;
                status: string;
            };
        }>;
    };
    captionId: string;
    format: string;
    text: string;
}

export const parseSRTText = (srtText: string): string => {
    const lines = srtText.split('\n');
    const textLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '' || /^\d+$/.test(line) || /^\d{2}:\d{2}:\d{2},\d{3}\s-->\s\d{2}:\d{2}:\d{2},\d{3}$/.test(line)) {
            continue;
        }

        if (line.length > 0) {
            textLines.push(line);
        }
    }

    return textLines.join(' ');
};

export const parseSRTWithTiming = (srtText: string): any[] => {
    const lines = srtText.split('\n');
    const segments: any[] = [];
    let currentSegment: any = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '') {
            if (currentSegment.text) {
                segments.push(currentSegment);
                currentSegment = {};
            }
        } else if (/^\d+$/.test(line)) {
        } else if (/^\d{2}:\d{2}:\d{2},\d{3}\s-->\s\d{2}:\d{2}:\d{2},\d{3}$/.test(line)) {
            const [start, end] = line.split(' --> ');
            currentSegment.start = start;
            currentSegment.end = end;
        } else if (line.length > 0) {
            if (currentSegment.text) {
                currentSegment.text += ' ' + line;
            } else {
                currentSegment.text = line;
            }
        }
    }
    if (currentSegment.text) {
        segments.push(currentSegment);
    }

    return segments;
};

const AnalysisCard = ({ analysis, index }: { analysis: any, index: number }) => {

    return (
            <div className="bg-white rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#9c3313] text-white text-xs px-2 py-1 rounded font-mono">
                        {analysis.timestamp}
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-semibold text-red-600 mb-1">What was wrong:</h4>
                        <p className="text-sm text-gray-700">{analysis["what was wrong"]}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-green-600 mb-1">What was good:</h4>
                        <p className="text-sm text-gray-700">{analysis["what was good"]}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-blue-600 mb-1">What can be improved:</h4>
                        <p className="text-sm text-gray-700">{analysis["what can be improved"]}</p>
                    </div>
                </div>
            </div>
    );
};

const Transcript = () => {
    const { data: session } = useSession();
    const [transcriptUrl, setTranscriptUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [originalSrtText, setOriginalSrtText] = useState('');
    const [captionInfo, setCaptionInfo] = useState<any>(null);
    const [transcriptDialogOpen, setTranscriptDialogOpen] = useState(false);
    const [parsedTranscript, setParsedTranscript] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState<any[]>([]);

    const handleAnalyzeTranscriptByUrl = async () => {
        if (!transcriptUrl.trim()) {
            toast.error('Please enter a video URL');
            return;
        }

        if (!session?.accessToken) {
            toast.error('Not authenticated');
            return;
        }

        const videoId = extractYouTubeVideoId(transcriptUrl);
        if (!videoId) {
            toast.error('Invalid YouTube video URL');
            return;
        }

        setTranscriptDialogOpen(true);
        setParsedTranscript([]);
        setError('');
        setTranscript('');
        setOriginalSrtText('');
        setCaptionInfo(null);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/transcribe?videoId=${encodeURIComponent(videoId)}`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken as string}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to transcribe video', { id: 'get-transcript' });
                return;
            }

            const data: TranscriptionResponse = await response.json();

            const cleanText = parseSRTText(data.text);
            setTranscript(cleanText);
            setOriginalSrtText(data.text)

            setCaptionInfo({
                format: data.format,
                language: data.metadata.items[0]?.snippet.language || 'Unknown',
                isAutoGenerated: data.metadata.items[0]?.snippet.trackKind === 'asr',
                lastUpdated: data.metadata.items[0]?.snippet.lastUpdated
            });
        } catch (err: any) {
            toast.error(err.message, { id: 'get-transcript' });
        } finally {
            setIsLoading(false);
        }
    }

    const analyzeWithAI = async () => {
        if (!originalSrtText || !session?.accessToken) {
            toast.error('No transcript available or not authenticated', { id: 'analyze-transcript-error' });
            return;
        }

        setIsAnalyzing(true);
        setTranscriptDialogOpen(false);
        setIsOpen(true);

        try {
            const parsedSegments = parseSRTWithTiming(originalSrtText);
            const formattedTranscript = parsedSegments
                .map(segment => `${segment.start}: ${segment.text}`)
                .join(', ');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/analyze-transcript`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transcript: formattedTranscript
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze transcript');
            }

            const result = await response.json();
            if (result.success) {
                toast.success('Transcript analyzed successfully!', { id: 'analyze-transcript-success' });
                if (typeof result.data === 'string') {
                    const parsedData = JSON.parse(result.data);
                    setAnalysisData(parsedData.analysis);
                } else {
                    setAnalysisData(result.data.analysis);
                }
                setShowAnalysis(true);
            } else {
                toast.error(result.message, { id: 'analyze-transcript-error' });
            }

        } catch (error: any) {
            console.error('Analysis error:', error);
            toast.error(error.message || 'Failed to analyze transcript');
        } finally {
            setIsAnalyzing(false);
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setAnalysisData([])
            setShowAnalysis(false)
            setIsAnalyzing(false)
            setIsLoading(false)
            setTranscriptDialogOpen(false)
        }
    }, [isOpen])

    return (
        <>
            <div className='h-auto min-h-60 w-full rounded-md p-6 flex flex-col justify-center bg-white shadow-sm border border-[#cfcfcf]'>
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-[black] mb-2">Analyze Transcript by URL</h3>
                    <p className="text-[#595959] text-sm">Break down your delivery, tone, and clarity.</p>
                </div>

                <div className="space-y-4">
                    <Input
                        type="url"
                        placeholder="Paste video URL for transcript analysis..."
                        value={transcriptUrl}
                        onChange={(e) => setTranscriptUrl(e.target.value)}
                        className="bg-transparent border-[#cfcfcf] text-[#231b1a] placeholder:text-[#7c6f6b] focus:border-[#9c3313] focus:ring-[#9c3313]/20 text-sm sm:text-base"
                    />

                    <button
                        onClick={handleAnalyzeTranscriptByUrl}
                        className='text-sm font-medium w-full px-4 justify-center rounded-sm border-[#cfcfcf] py-[10px] border shadow-sm hover:bg-[#f0f0f0] transition-all duration-200 flex items-center'
                    >
                        <MdAutoAwesome size={16} className="inline mr-2" />
                        Analyze
                    </button>
                </div>
            </div>

            <Dialog open={transcriptDialogOpen} onOpenChange={() => {
                setTranscriptDialogOpen(false);
                setTranscriptUrl('');
                setError('');
                setTranscript('');
                setOriginalSrtText('');
                setCaptionInfo(null);
                setParsedTranscript([]);
                setAnalysisData([]);
                setShowAnalysis(false);
                setIsAnalyzing(false);
                setIsLoading(false);
            }}>
                <DialogContent className="h-[90vh] overflow-y-auto flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MdAutoAwesome size={20} className="text-[#9c3313]" />
                            {showAnalysis ? 'Transcript Analysis' : 'Video Transcript'}
                        </DialogTitle>
                        {transcript && <p className='text-xs text-[#7c6f6b] flex gap-1'><Info className='translate-y-[1px]' size={14} /> {showAnalysis ? 'Pulsey AI Insights' : 'Official YouTube Data'}</p>}
                        {captionInfo && (
                            <div className="flex gap-4 text-sm text-[#7c6f6b]">
                                <span>Language: {captionInfo.language.toUpperCase()}</span>
                                <span>Format: {captionInfo.format.toUpperCase()}</span>
                                {captionInfo.isAutoGenerated && <span className="text-orange-600">Auto-generated</span>}
                            </div>
                        )}
                    </DialogHeader>

                    <div className="flex-1 flex flex-col justify-center items-center overflow-y-auto">
                        {isLoading ? (
                            <div className="flex flex-col h-full items-center justify-center py-20">
                                <div className="loader"></div>
                                <p className="text-[#7c6f6b] text-sm mt-10">Getting your transcript...</p>
                            </div>
                        ) : isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center py-20 h-full">
                                <div className="loader"></div>
                                <p className="text-[#7c6f6b] text-sm mt-10">Analyzing your transcript...</p>
                            </div>
                        ) : transcript ? (
                            <div className="bg-gray-50 h-full rounded-lg p-4">
                                <p className="text-[15px] text-[#231b1a]">
                                    {transcript}
                                </p>
                            </div>
                        ) : !isLoading && !isAnalyzing && !transcript && !showAnalysis ? (
                            <div className='text-center h-full flex flex-col justify-center items-center'>
                                <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                                    <FaSearch className='text-gray-400' size={32} />
                                </div>
                                <p className='text-lg font-medium text-[#231b1a] mb-2'>No transcript found</p>
                                <p className='text-sm text-[#5b5b5b]'>Something went wrong on our end, Please wait while we fix it.</p>
                            </div>
                        ) : null}
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        {!isLoading && !isAnalyzing && transcript && !showAnalysis && (
                            <button
                                onClick={analyzeWithAI}
                                disabled={isAnalyzing}
                                className="bg-[#9c3313] text-white px-6 py-2 rounded-lg hover:bg-[#d94010] transition-colors duration-200 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MdAutoAwesome size={16} className="inline mr-2" />
                                {isAnalyzing ? 'Analyzing...' : 'Analyze with Pulsey'}
                            </button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className='absolute'>
                <AIResponse heading='Transcript Analysis' showFeedback={isAnalyzing} isOpen={isOpen} setIsOpen={setIsOpen} ai_response={analysisData}
                    content={
                        <div className='flex flex-col mt-10 text-start justify-start items-start'>
                            {isAnalyzing && (
                                <div className='flex absolute w-full h-screen top-0 left-0 flex-col items-center justify-start'>
                                    <div className="loader"></div>
                                    <div className='-translate-y-10'>
                                        <p className='text-sm text-[#202020] text-center font-medium'>
                                            Analyzing your transcript...
                                        </p>
                                    </div>
                                </div>
                            )}

                            {analysisData && analysisData.length > 0 && <div className='space-y-3 p-5 w-full shadow-md rounded-3xl border text-start'>
                                <TypeWriter>
                                    <div className='mb-8'>
                                        <h1 className='text-center text-2xl mb-4 font-bold'>✦ Pulsey's Analysis</h1>
                                        <p className='text-xs text-center text-[#7c6f6b] mt-1'><strong>Note:</strong> These insights are generated by Pulsey AI and are not official YouTube metrics.</p>
                                    </div>
                                    {analysisData.map((analysis, index) => (
                                        <AnalysisCard analysis={analysis} index={index} />
                                    ))}
                                </TypeWriter>
                            </div>}
                        </div>
                    }
                />
            </div>
        </>
    )
}

export default Transcript