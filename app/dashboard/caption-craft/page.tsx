"use client";

import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CaptionGenerator from './_components/Caption-Generator';
import HookGenerator from './_components/Hook-Generator';
import HashtagsGenerator from './_components/Hashtags-Generator';
import AnalyzeThumbnail from './_components/AnalyzeThumbnail';
import { FaRegImage } from 'react-icons/fa';

const CaptionCraftPage = () => {
    const [videoType, setVideoType] = useState<'shorts' | 'long'>('shorts');
    const [activeTab, setActiveTab] = useState<'caption' | 'hook' | 'hashtags'>('caption');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AnalyzeThumbnail isOpen={isOpen} onOpenChange={setIsOpen} />

            <section className="flex flex-col w-full bg-[#f3f3f3] items-center h-full lg:h-screen justify-start sm:p-2 relative">
                <div className="w-full max-w-7xl mx-auto bg-white overflow-y-auto h-full sm:rounded-sm border-t sm:border md:p-8 px-6 py-8 relative" style={{ scrollbarWidth: 'thin' }}>
                    <div className='flex mb-6 sm:mb-8 xl:flex-row flex-col gap-4 justify-between xl:items-center'>
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#231b1a] mb-1">Caption Craft Studio</h2>
                            <p className="text-sm sm:text-base text-[#7c6f6b]">Create engaging captions, hooks, and hashtags for your content</p>
                        </div>

                        <div>
                            <button className='text-[13px] px-4 py-2 bg-[#9c3313] text-white rounded-sm hover:bg-[#9c3313]/80 shadow-sm transition-all duration-200 w-fit flex items-center gap-2' onClick={() => setIsOpen(true)}>Analyze Thumbnail <FaRegImage size={16} /></button>
                        </div>
                    </div>

                    {/* Video Type Toggle */}
                    <div className="bg-white rounded-sm p-4 sm:p-6 border border-[#e7e7e7] shadow-sm mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between gap-4">
                            <div className="space-y-1">
                                <Label className="text-sm sm:text-base font-semibold text-slate-900">
                                    Video Type
                                </Label>
                                <p className="text-xs sm:text-sm text-slate-600">
                                    Select the type of video you're creating content for
                                </p>
                            </div>
                            <div className="flex items-center lg:justify-end space-x-3 sm:space-x-4">
                                <span className={`text-xs sm:text-sm font-medium transition-colors ${videoType === 'shorts' ? 'text-[#d94010]' : 'text-slate-500'
                                    }`}>
                                    YouTube Shorts
                                </span>
                                <Switch
                                    checked={videoType === 'long'}
                                    onCheckedChange={(checked) => setVideoType(checked ? 'long' : 'shorts')}
                                    className="data-[state=checked]:bg-[#d94010]"
                                />
                                <span className={`text-xs sm:text-sm font-medium transition-colors ${videoType === 'long' ? 'text-[#d94010]' : 'text-slate-500'
                                    }`}>
                                    Long Videos
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Glass Radio Group Switcher */}
                    <div className="bg-white rounded-xl mb-6">
                        <div className="flex justify-center mb-6">
                            <div className="glass-radio-group">
                                <input
                                    type="radio"
                                    name="generator"
                                    id="glass-caption"
                                    checked={activeTab === 'caption'}
                                    onChange={() => setActiveTab('caption')}
                                />
                                <label htmlFor="glass-caption">Caption</label>

                                <input
                                    type="radio"
                                    name="generator"
                                    id="glass-hook"
                                    checked={activeTab === 'hook'}
                                    onChange={() => setActiveTab('hook')}
                                />
                                <label htmlFor="glass-hook">Hook</label>

                                <input
                                    type="radio"
                                    name="generator"
                                    id="glass-hashtags"
                                    checked={activeTab === 'hashtags'}
                                    onChange={() => setActiveTab('hashtags')}
                                />
                                <label htmlFor="glass-hashtags">Hashtag</label>

                                <div className="glass-glider"></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            {activeTab === 'caption' && <CaptionGenerator videoType={videoType} />}
                            {activeTab === 'hook' && <HookGenerator videoType={videoType} />}
                            {activeTab === 'hashtags' && <HashtagsGenerator videoType={videoType} />}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CaptionCraftPage;