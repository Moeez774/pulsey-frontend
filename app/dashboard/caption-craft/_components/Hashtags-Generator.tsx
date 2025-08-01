"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

interface HashtagsGeneratorProps {
    videoType: 'shorts' | 'long';
}

const HashtagsGenerator: React.FC<HashtagsGeneratorProps> = ({ videoType }) => {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        videoTopic: '',
        audienceNiche: '',
        hashtagFormat: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedHashtags, setGeneratedHashtags] = useState<{
        trending: string[];
        niche: string[];
        mixed: string[];
    } | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const nicheOptions = [
        { value: 'fashion', label: 'Fashion' },
        { value: 'gaming', label: 'Gaming' },
        { value: 'fitness', label: 'Fitness' },
        { value: 'tech', label: 'Tech' },
        { value: 'beauty', label: 'Beauty' },
        { value: 'comedy', label: 'Comedy' },
        { value: 'food', label: 'Food' },
        { value: 'travel', label: 'Travel' },
        { value: 'education', label: 'Education' },
        { value: 'business', label: 'Business' }
    ];

    const formatOptions = [
        { value: 'trending', label: 'Trending' },

        { value: 'niche-specific', label: 'Niche-Specific' },

        { value: 'high-reach-general', label: 'High Reach / General' },

        { value: 'mixed-strategy', label: 'Mixed Strategy' },

        { value: 'clean-minimal', label: 'Clean & Minimal' },

        { value: 'keyword-rich-seo', label: 'Keyword-Rich (SEO)' },

        { value: 'platform-tuned', label: 'Platform-Tuned' },
    ];

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = async () => {
        if (!formData.videoTopic || !formData.hashtagFormat || !formData.audienceNiche) {
            toast.error("Please fill all the fields", { id: "hashtags" });
            return;
        }
        setIsGenerating(true);
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/caption-craft/generate-hashtags`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    video_type: videoType,
                    video_topic: formData.videoTopic,
                    audience_niche: formData.audienceNiche,
                    hashtag_format: formData.hashtagFormat,
                    user_id: user?._id
                })
            });
            const data = await res.json();
            if (data.trending && data.niche && data.mixed) {
                setGeneratedHashtags({
                    trending: data.trending,
                    niche: data.niche,
                    mixed: data.mixed
                });
            } else if (typeof data.data === 'string') {
                const parsedData = JSON.parse(data.data);
                setGeneratedHashtags({
                    trending: parsedData.trending,
                    niche: parsedData.niche,
                    mixed: parsedData.mixed
                });
            } else {
                toast.error(data.message || "No hashtags generated", { id: "hashtags" });
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong", { id: "hashtags" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard", { id: "hashtags" });
    };


    const getHashtagsToShow = () => {
        if (!generatedHashtags) return [];

        switch (formData.hashtagFormat) {
            case 'trending':
                return generatedHashtags.trending;
            case 'niche-specific':
                return generatedHashtags.niche;
            case 'mixed-strategy':
                return generatedHashtags.mixed;
            default:
                return generatedHashtags.mixed;
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Form Section */}
            <Card className="p-0 md:px-4 py-6 lg:p-6 shadow-none md:shadow-sm mt-10 max-w-2xl border-0 rounded-sm w-full mx-auto md:border md:border-[#e7e7e7]">
                <CardHeader className='p-0'>
                    <CardTitle className="text-lg sm:text-xl text-slate-900">
                        Hashtag Generator
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Generate optimized hashtags for your {videoType === 'shorts' ? 'YouTube Shorts' : 'long videos'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-0 sm:space-y-6">
                    {/* Video Topic */}
                    <div className="space-y-2">
                        <Label htmlFor="videoTopic" className="text-xs sm:text-sm font-semibold text-slate-900">
                            Video Topic / Keywords
                        </Label>
                        <Textarea
                            id="videoTopic"
                            placeholder="What is your video about?"
                            value={formData.videoTopic}
                            onChange={(e) => handleInputChange('videoTopic', e.target.value)}
                            rows={3}
                            className="w-full border-slate-300 focus:border-[#d94010] focus:ring-[#d94010] resize-none text-sm"
                        />
                    </div>

                    {/* Audience Niche */}
                    <div className="space-y-2">
                        <Label htmlFor="audienceNiche" className="text-xs sm:text-sm font-semibold text-slate-900">
                            Audience / Niche
                        </Label>
                        <Select value={formData.audienceNiche} onValueChange={(value) => handleInputChange('audienceNiche', value)}>
                            <SelectTrigger className="w-full border-slate-300 focus:border-[#d94010] focus:ring-[#d94010] text-sm">
                                <SelectValue placeholder="Choose a niche" />
                            </SelectTrigger>
                            <SelectContent className='max-h-48 overflow-y-auto'>
                                {nicheOptions.map((niche) => (
                                    <SelectItem key={niche.value} value={niche.value}>
                                        {niche.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Hashtag Format */}
                    <div className="space-y-2">
                        <Label htmlFor="hashtagFormat" className="text-xs sm:text-sm font-semibold text-slate-900">
                            Hashtag Format
                        </Label>
                        <Select value={formData.hashtagFormat} onValueChange={(value) => handleInputChange('hashtagFormat', value)}>
                            <SelectTrigger className="w-full border-slate-300 focus:border-[#d94010] focus:ring-[#d94010] text-sm">
                                <SelectValue placeholder="Select hashtag format" />
                            </SelectTrigger>
                            <SelectContent className='max-h-48 overflow-y-auto'>
                                {formatOptions.map((format) => (
                                    <SelectItem key={format.value} value={format.value}>
                                        {format.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !formData.videoTopic.trim() || !formData.hashtagFormat || !formData.audienceNiche}
                        className="w-full mt-4 cursor-pointer bg-[#d94010] hover:bg-[#9c3313] text-white font-medium py-3 transition-all duration-200"
                    >
                        {isGenerating ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Generating Hashtags...</span>
                            </div>
                        ) : (
                            'Generate Hashtags'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Results Section */}
            <div ref={resultsRef} className="mt-8">
                {/* Loading State */}
                {isGenerating && (
                    <Card className="flex shadow-none border-none items-center justify-center max-w-7xl w-full mx-auto">
                        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="loader"></div>
                            <div className="text-center mt-10 space-y-2">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Generating your hashtags
                                </h3>
                                <p className="text-xs text-slate-600">
                                    This may take a few seconds
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Generated Hashtags */}
                {generatedHashtags && !isGenerating && (
                    <div className="space-y-6 max-w-7xl w-full mx-auto">
                        {/* Main Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                                Generated Hashtags
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy([
                                    ...generatedHashtags.trending,
                                    ...generatedHashtags.niche,
                                    ...generatedHashtags.mixed
                                ].join(' '))}
                                className="text-xs flex items-center gap-1 px-3 py-1 border rounded-md cursor-pointer"
                            >
                                <Copy size={14} /> Copy All
                            </Button>
                        </div>

                        {/* Trending Hashtags Card */}
                        <Card className="shadow-lg border border-slate-200 rounded-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold text-slate-900">
                                        Trending Hashtags
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopy(generatedHashtags.trending.join(' '))}
                                        className="text-xs flex items-center gap-1 px-2 py-1 border rounded-md cursor-pointer"
                                    >
                                        <Copy size={12} /> Copy
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex flex-wrap gap-2">
                                    {generatedHashtags.trending.map((hashtag, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                                            <span className="text-slate-800 text-sm font-medium">{hashtag}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopy(hashtag)}
                                                className="text-xs flex items-center gap-1 border px-2 py-1 cursor-pointer rounded-md"
                                            >
                                                <Copy size={12} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Niche Hashtags Card */}
                        <Card className="shadow-lg border border-slate-200 rounded-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold text-slate-900">
                                        Niche-Specific Hashtags
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopy(generatedHashtags.niche.join(' '))}
                                        className="text-xs flex items-center gap-1 px-2 py-1 border rounded-md cursor-pointer"
                                    >
                                        <Copy size={12} /> Copy
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex flex-wrap gap-2">
                                    {generatedHashtags.niche.map((hashtag, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                                            <span className="text-slate-800 text-sm font-medium">{hashtag}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopy(hashtag)}
                                                className="text-xs flex items-center gap-1 border px-2 py-1 cursor-pointer rounded-md"
                                            >
                                                <Copy size={12} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mixed Hashtags Card */}
                        <Card className="shadow-lg border border-slate-200 rounded-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold text-slate-900">
                                        Mixed Strategy Hashtags
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopy(generatedHashtags.mixed.join(' '))}
                                        className="text-xs flex items-center gap-1 px-2 py-1 border rounded-md cursor-pointer"
                                    >
                                        <Copy size={12} /> Copy
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex flex-wrap gap-2">
                                    {generatedHashtags.mixed.map((hashtag, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                                            <span className="text-slate-800 text-sm font-medium">{hashtag}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopy(hashtag)}
                                                className="text-xs flex items-center gap-1 border px-2 py-1 cursor-pointer rounded-md"
                                            >
                                                <Copy size={12} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HashtagsGenerator; 