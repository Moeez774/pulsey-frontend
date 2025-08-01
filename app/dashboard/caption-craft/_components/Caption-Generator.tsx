"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

interface CaptionGeneratorProps {
    videoType: 'shorts' | 'long';
}

const CaptionGenerator: React.FC<CaptionGeneratorProps> = ({ videoType }) => {
    const [formData, setFormData] = useState({
        videoTopic: '',
        tone: '',
        targetAudience: '',
        includeHashtags: true
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const { user } = useAuth()
    const [generatedContent, setGeneratedContent] = useState<{
        caption: string;
        hashtags: string[];
    } | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const toneOptions = [
        { value: 'bold', label: 'Bold' },

        { value: 'funny', label: 'Funny' },

        { value: 'informative', label: 'Informative' },

        { value: 'emotional', label: 'Emotional' },

        { value: 'motivational', label: 'Motivational' },

        { value: 'shocking', label: 'Shocking' },

        { value: 'chill', label: 'Chill' },

        { value: 'curious', label: 'Curious' },

        { value: 'witty', label: 'Witty' },

        { value: 'direct cta', label: 'Direct CTA' },

        { value: 'mysterious', label: 'Mysterious' },
    ];

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = async () => {
        if (!formData.videoTopic || !formData.tone || !formData.targetAudience) {
            toast.error("Please fill all the fields", { id: "caption" });
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/caption-craft/generate-caption`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    video_type: videoType,
                    video_topic: formData.videoTopic,
                    tone: formData.tone,
                    target_audience: formData.targetAudience,
                    include_hashtags: formData.includeHashtags,
                    user_id: user?._id
                })
            });

            const data = await res.json();

            if (data.success) {
                if (typeof data.data === 'string') {
                    const parsedData = JSON.parse(data.data);
                    setGeneratedContent({
                        caption: parsedData.caption,
                        hashtags: parsedData.hashtags
                    });
                } else {
                    setGeneratedContent({
                        caption: data.data.caption,
                        hashtags: data.data.hashtags
                    });
                }
            } else {
                toast.error(data.message, { id: "caption" });
            }

        } catch (err: any) {
            toast.error(err.message || "Something went wrong", { id: "caption" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard", { id: "caption" });
    };

    return (
        <div className="space-y-4 md:px-4 sm:space-y-6">
            {/* Form Section */}
            <Card className="p-0 md:px-4 py-6 lg:p-6 shadow-none md:shadow-sm mt-10 max-w-2xl border-0 rounded-sm w-full mx-auto md:border md:border-[#e7e7e7]">
                <CardHeader className='p-0'>
                    <CardTitle className="text-lg sm:text-xl text-slate-900">
                        Caption Generator
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Create engaging captions for your {videoType === 'shorts' ? 'YouTube Shorts' : 'long videos'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-0 sm:space-y-6">

                    {/* Video Topic */}
                    <div className="space-y-2">
                        <Label htmlFor="videoTopic" className="text-xs sm:text-sm font-semibold text-slate-900">
                            Video Topic or Summary
                        </Label>
                        <Textarea
                            id="videoTopic"
                            placeholder="Briefly describe what this video is about (e.g., A tutorial on how to edit Reels in CapCut with trending audio)"
                            value={formData.videoTopic}
                            onChange={(e) => handleInputChange('videoTopic', e.target.value)}
                            rows={3}
                            className="w-full h-32 border-slate-300 focus:border-[#d94010] focus:ring-[#d94010] resize-none text-sm"
                        />
                    </div>

                    {/* Tone Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="tone" className="text-xs sm:text-sm font-semibold text-slate-900">
                            Tone of Caption
                        </Label>
                        <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                            <SelectTrigger className="w-full border-slate-300 focus:border-[#d94010] focus:ring-[#d94010] text-sm">
                                <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                            <SelectContent className='max-h-48 overflow-y-auto'>
                                {toneOptions.map((tone) => (
                                    <SelectItem key={tone.value} value={tone.value}>
                                        {tone.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                        <Label htmlFor="targetAudience" className="text-xs sm:text-sm font-semibold text-slate-900">
                            Target Audience
                        </Label>
                        <Input
                            id="targetAudience"
                            placeholder="Who is this video for? (e.g., photographers, gamers, Gen Z)"
                            value={formData.targetAudience}
                            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                            className="w-full border-slate-300 focus:border-[#d94010] focus:ring-[#d94010] text-sm"
                        />
                    </div>

                    {/* Include Hashtags Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs sm:text-sm font-semibold text-slate-900">
                                Include Hashtags
                            </Label>
                            <p className="text-xs text-slate-600">
                                Generate hashtags with the caption
                            </p>
                        </div>
                        <Switch
                            checked={formData.includeHashtags}
                            onCheckedChange={(checked) => handleInputChange('includeHashtags', checked)}
                            className="data-[state=checked]:bg-[#d94010] self-start sm:self-center"
                        />
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !formData.videoTopic.trim() || !formData.tone || !formData.targetAudience}
                        className="w-full cursor-pointer mt-4 bg-[#d94010] hover:bg-[#9c3313] text-white font-medium py-3 transition-all duration-200"
                    >
                        {isGenerating ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Generating...</span>
                            </div>
                        ) : (
                            'Generate Caption'
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
                                    Generating your caption
                                </h3>
                                <p className="text-xs text-slate-600">
                                    This may take a few seconds
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Generated Content */}
                {generatedContent && !isGenerating && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Generated Caption */}
                        <Card className="max-w-7xl shadow-none border-none w-full mx-auto">
                            <CardHeader className="p-0 pb-4">
                                <CardTitle className="text-lg sm:text-xl text-slate-900 flex items-center justify-between">
                                    Generated Caption
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopy(generatedContent.caption)}
                                        className="text-xs cursor-pointer flex items-center gap-1 px-2 border rounded-sm"
                                    >
                                        <Copy size={16} /> Copy
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 max-w-7xl w-full mx-auto">
                                <div className="rounded-xl p-4 md:p-6 shadow-md border bg-[#ffffff]">
                                    <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                                        {generatedContent.caption}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Generated Hashtags */}
                        {formData.includeHashtags && generatedContent.hashtags.length > 0 && (
                            <Card className="max-w-7xl shadow-none border-none w-full mx-auto">
                                <CardHeader className="p-0 pb-4">
                                    <CardTitle className="text-lg sm:text-xl text-slate-900 flex items-center justify-between">
                                        Generated Hashtags
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopy(generatedContent.hashtags.join(' '))}
                                            className="text-xs flex items-center gap-1 border px-2 cursor-pointer rounded-sm"
                                        >
                                            <Copy size={16} /> Copy
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 max-w-7xl w-full mx-auto">
                                    <div className="flex flex-wrap gap-3">
                                        {generatedContent.hashtags.map((hashtag, index) => (
                                            <span
                                                key={index}
                                                className="bg-[#f0f0f0] text-[#202020] px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm"
                                            >
                                                #{hashtag}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaptionGenerator; 