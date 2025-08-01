import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { CheckCircle, XCircle, TrendingUp, Loader2 } from 'lucide-react';
import TypeWriter from '@/components/common/TypeWriter';

interface AnalysisResult {
    summary: string;
    bad_points: {
        point_1: string;
        point_2: string;
        point_3: string;
    };
    good_points: {
        point_1: string;
        point_2: string;
        point_3: string;
    };
    improvements: {
        point_1: string;
        point_2: string;
        point_3: string;
    };
    ready_to_use: string;
}

const AnalyzeByImg = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [videoTopic, setVideoTopic] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
        if (!file) return;

        const data = new FormData();
        data.append('file', file);

        try {
            const uploadImg = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/upload`, {
                method: "POST",
                body: data
            })

            const response = await uploadImg.json();
            if (response.url) {
                setImagePreview(encodeURI(response.url));
            } else {
                console.error("Upload failed", response);
            }
        } catch (error) {
            console.error("Error uploading image", error);
        }
    };

    const handleAnalyze = async () => {
        if (!imagePreview || !videoTopic) {
            toast.error('Please upload an image and enter a video topic first', { id: 'upload-image' });
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/caption-craft/analyze-thumbnail`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: imagePreview, video_topic: videoTopic })
            })

            const data = await response.json();

            if (data.success && data.data) {
                setAnalysisResult(data.data);
            } else {
                toast.error('Analysis failed. Please try again.', { id: 'analyze-error' });
            }

        } catch (err: any) {
            toast.error(err.message || 'Something went wrong', { id: 'analyze-error' });
        } finally {
            setIsAnalyzing(false);
        }
    }

    const handleReset = () => {
        setAnalysisResult(null);
        setIsAnalyzing(false);
    }

    return (
        <div className="space-y-6">
            {/* Input Form */}
            {!isAnalyzing && !analysisResult && (
                <>
                    <div className="relative">
                        <div
                            className="h-40 hover:bg-[#fcfcfc] bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={() => document.getElementById('image-upload')?.click()}
                        >
                            {imagePreview ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                        <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 text-white text-center">
                                            <img src="/Images/caption-craft/photo.png" alt="" className='w-10 h-10 mx-auto mb-4' />
                                            <p className="text-sm">Click to change image</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <img src="/Images/caption-craft/photo.png" alt="" className='w-10 h-10 mx-auto mb-4' />
                                    <p className="text-base font-medium text-gray-600 mb-2">Upload your thumbnail here</p>
                                    <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF</p>
                                </div>
                            )}
                        </div>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    <div className='mb-6'>
                        <h1 className='text-sm font-medium mb-1 text-black'>Video Topic</h1>
                        <p className='text-[13px] text-[#595959] mb-2'>Video topic will help our model to analyze the thumbnail more accurately</p>
                        <Input
                            placeholder="Enter Video Topic"
                            value={videoTopic}
                            onChange={(e) => setVideoTopic(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <Button
                        onClick={handleAnalyze}
                        disabled={!selectedImage || !videoTopic}
                        className="w-full bg-[#9c3313] hover:bg-[#9c3313]/80"
                    >
                        Analyze Thumbnail
                    </Button>
                </>
            )}

            {/* AI Response Card */}
            {(isAnalyzing || analysisResult) && (
                <Card className="w-full gap-4">
                    <CardHeader className='px-4'>
                        <CardTitle className="text-base font-semibold text-black flex items-center gap-2">
                            {isAnalyzing ? (
                                <div className='flex gap-2'>
                                    <Loader2 className="w-4 mt-0.5 h-4 text-[#9c3313] animate-spin" />
                                    <div className='flex items-start flex-col gap-1'>
                                        <h1 className='text-sm font-semibold text-black'>Analyzing Thumbnail</h1>
                                        <p className='text-xs font-normal text-[#595959]'>This may take a few seconds...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <TrendingUp className="w-4 h-4 text-[#9c3313]" />
                                    AI Analysis Complete
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 px-4">
                        {isAnalyzing ? (
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                            </div>
                        ) : analysisResult ? (
                            <TypeWriter>
                                <div className="space-y-6">
                                    <div className={`p-4 rounded-lg border-2 ${analysisResult.ready_to_use === "Yes" ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            {analysisResult.ready_to_use === "Yes" ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                            <h3 className="text-sm font-semibold text-black">
                                                {analysisResult.ready_to_use === "Yes" ? "Ready to Use" : "Needs Improvement"}
                                            </h3>
                                        </div>
                                        <p className="text-[13px] text-[#595959]">
                                            {analysisResult.ready_to_use === "Yes" ? "Your thumbnail is ready to use!" : "Your thumbnail needs improvements before use."}
                                        </p>
                                    </div>

                                    {/* Summary */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-black mb-2">Summary</h3>
                                        <p className="text-[13px] text-[#595959] leading-relaxed">{analysisResult.summary}</p>
                                    </div>

                                    {/* Good Points */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-black mb-2">Good Points</h3>
                                        <div className="space-y-2">
                                            <p className="text-[13px] text-[#595959] flex items-start gap-2">
                                                {`• ${analysisResult.good_points.point_1}`}
                                            </p>
                                            <p className="text-[13px] text-[#595959] flex items-start gap-2">
                                                {`• ${analysisResult.good_points.point_2}`}
                                            </p>
                                            <p className="text-[13px] text-[#595959] flex items-start gap-2">
                                                {`• ${analysisResult.good_points.point_3}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Areas for Improvement */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-black mb-2">Areas for Improvement</h3>
                                        <div className="space-y-2">
                                            <p className="text-[13px] text-[#595959] flex items-start gap-2">
                                                {`• ${analysisResult.bad_points.point_1}`}
                                            </p>
                                            <p className="text-[13px] text-[#595959] flex items-start gap-2">
                                                {`• ${analysisResult.bad_points.point_2}`}
                                            </p>
                                            <p className="text-[13px] text-[#595959] flex items-start gap-2">
                                                {`• ${analysisResult.bad_points.point_3}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Suggested Improvements */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-black mb-2">Suggested Improvements</h3>
                                        <div className="space-y-2">
                                            <p className="text-[13px] text-[#595959] flex items-start gap-2">
                                                {`• ${analysisResult.improvements.point_1}`}
                                            </p>
                                            <p className="text-[13px] text-[#595959] flex items-start gap-2">
                                                {`• ${analysisResult.improvements.point_2}`}
                                            </p>
                                            <p className="text-[13px] text-[#595959] flex items-start gap-2">
                                                {`• ${analysisResult.improvements.point_3}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reset Button */}
                                    <Button
                                        onClick={handleReset}
                                        className="w-full bg-[#9c3313] hover:bg-[#9c3313]/80"
                                    >
                                        Analyze Another Thumbnail
                                    </Button>
                                </div>
                            </TypeWriter>
                        ) : null}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default AnalyzeByImg