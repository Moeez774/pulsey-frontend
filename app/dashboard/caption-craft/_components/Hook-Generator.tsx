"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

interface HookGeneratorProps {
    videoType: 'shorts' | 'long';
}

const HookGenerator: React.FC<HookGeneratorProps> = ({ videoType }) => {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        videoTopic: '',
        hookType: '',
        targetReaction: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);
    const resultsRef = useRef<HTMLDivElement>(null);

    const hookTypeOptions = [
        { value: 'curiosity', label: 'Curiosity' },
        { value: 'shock-surprise', label: 'Shock / Surprise' },
        { value: 'pain-point', label: 'Pain-Point' },
        { value: 'solution-based', label: 'Solution-Based' },
        { value: 'relatable-story', label: 'Relatable Story' },
        { value: 'stat-fact', label: 'Stat / Fact' },
        { value: 'question', label: 'Question' },
        { value: 'tutorial-how-to', label: 'Tutorial / How-to' },
        { value: 'controversial', label: 'Controversial' },
        { value: 'time-based-urgency', label: 'Time-Based / Urgency' },
    ];

    const reactionOptions = [
        { value: 'surprise', label: 'Surprise' },
        { value: 'intrigue', label: 'Intrigue' },
        { value: 'empathy', label: 'Empathy' },
        { value: 'urgency', label: 'Urgency' }
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = async () => {
        if (!formData.videoTopic || !formData.hookType || !formData.targetReaction) {
            toast.error("Please fill all the fields", { id: "hook" });
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/caption-craft/generate-hook`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    video_type: videoType,
                    video_topic: formData.videoTopic,
                    hook_type: formData.hookType,
                    target_reaction: formData.targetReaction,
                    user_id: user?._id
                })
            });
            const data = await res.json();
            if (data.data) {
                if (typeof data.data === 'string') {
                    const parsedData = JSON.parse(data.data);
                    setGeneratedHooks(Object.values(parsedData));
                } else {
                    setGeneratedHooks(Object.values(data.data));
                }
            } else {
                toast.error(data.message || "No hooks generated", { id: "hook" });
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong", { id: "hook" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard", { id: "hook" });
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Form Section */}
            <Card className="p-0 md:px-4 py-6 lg:p-6 shadow-none md:shadow-sm mt-10 max-w-2xl border-0 rounded-sm w-full mx-auto md:border md:border-[#e7e7e7]">
                <CardHeader className='p-0'>
                    <CardTitle className="text-lg sm:text-xl text-slate-900">
                        Hook Generator
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Create compelling hooks for your {videoType === 'shorts' ? 'YouTube Shorts' : 'long videos'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-0 sm:space-y-6">
                    {/* Video Topic */}
                    <div className="space-y-2">
                        <Label htmlFor="videoTopic" className="text-xs sm:text-sm font-semibold text-slate-900">
                            Video Topic or Idea
                        </Label>
                        <Textarea
                            id="videoTopic"
                            placeholder="What's the main idea or content of the video?"
                            value={formData.videoTopic}
                            onChange={(e) => handleInputChange('videoTopic', e.target.value)}
                            rows={3}
                            className="w-full border-slate-300 focus:border-[#d94010] focus:ring-[#d94010] resize-none text-sm"
                        />
                    </div>

                    {/* Hook Type */}
                    <div className="space-y-2">
                        <Label htmlFor="hookType" className="text-xs sm:text-sm font-semibold text-slate-900">
                            What kind of hook do you prefer?
                        </Label>
                        <Select value={formData.hookType} onValueChange={(value) => handleInputChange('hookType', value)}>
                            <SelectTrigger className="w-full border-slate-300 focus:border-[#d94010] focus:ring-[#d94010] text-sm">
                                <SelectValue placeholder="Select hook type" />
                            </SelectTrigger>
                            <SelectContent className='max-h-48 overflow-y-auto'>
                                {hookTypeOptions.map((hook) => (
                                    <SelectItem key={hook.value} value={hook.value}>
                                        {hook.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Target Reaction */}
                    <div className="space-y-2">
                        <Label htmlFor="targetReaction" className="text-xs sm:text-sm font-semibold text-slate-900">
                            Target Viewer Reaction
                        </Label>
                        <Select value={formData.targetReaction} onValueChange={(value) => handleInputChange('targetReaction', value)}>
                            <SelectTrigger className="w-full border-slate-300 focus:border-[#d94010] focus:ring-[#d94010] text-sm">
                                <SelectValue placeholder="What do you want the viewer to feel in the first 3 seconds?" />
                            </SelectTrigger>
                            <SelectContent>
                                {reactionOptions.map((reaction) => (
                                    <SelectItem key={reaction.value} value={reaction.value}>
                                        {reaction.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !formData.videoTopic.trim() || !formData.hookType || !formData.targetReaction}
                        className="w-full cursor-pointer mt-4 bg-[#d94010] hover:bg-[#9c3313] text-white font-medium py-3 transition-all duration-200"
                    >
                        {isGenerating ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Generating Hooks...</span>
                            </div>
                        ) : (
                            'Generate Hooks'
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
                                    Generating your hooks
                                </h3>
                                <p className="text-xs text-slate-600">
                                    This may take a few seconds
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Generated Hooks */}
                {generatedHooks.length > 0 && !isGenerating && (
                    <Card className="max-w-7xl shadow-none border-none w-full mx-auto">
                        <CardHeader className="p-0 pb-4">
                            <CardTitle className="text-lg sm:text-xl text-slate-900 flex items-center justify-between">
                                Generated Hooks
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopy(generatedHooks.join('\n'))}
                                    className="text-xs flex items-center gap-1 px-2 border rounded-sm"
                                >
                                    <Copy size={16} /> Copy All
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 max-w-7xl w-full mx-auto">
                            <div className="flex flex-col gap-3">
                                {generatedHooks.map((hook, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-[#fefefe] rounded-lg px-4 py-3 shadow-md border">
                                        <span className="flex-1 text-[#202020] text-base font-medium">{hook}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopy(hook)}
                                            className="text-xs flex items-center gap-1 border px-2 cursor-pointer rounded-sm"
                                        >
                                            <Copy size={16} /> Copy
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default HookGenerator; 