'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Sparkles, Eye, EyeOff, MessageSquare, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface LineByLineBreakdownProps {
    analysisData: any;
}

const LineByLineBreakdown: React.FC<LineByLineBreakdownProps> = ({ analysisData }) => {
    const [showRewritten, setShowRewritten] = useState<number[]>([])

    const topBadLines = analysisData?.top_bad_lines || [];

    const lineData = topBadLines.map((item: any, index: number) => ({
        lineNumber: index + 1,
        text: item.line,
        timestamp: item.timestamp,
        clarity: item.problem?.includes('unclear') ? 'poor' : 'good',
        hook: item.problem?.includes('hook') ? 'poor' : 'good',
        emotion: item.problem?.includes('lacks excitement') ? 'poor' : 'neutral',
        suggestion: item.suggested_alternative || 'No suggestion available',
        problem: item.problem || 'No problem identified',
        tag: item.problem?.length > 50 ? 'Must Fix' : item.problem?.length > 30 ? 'Needs Work' : 'Good Line'
    }));

    const toggleRewritten = (lineNumber: number) => {
        setShowRewritten(prev =>
            prev.includes(lineNumber)
                ? prev.filter(num => num !== lineNumber)
                : [...prev, lineNumber]
        )
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'good':
                return <CheckCircle size={16} className="text-green-600" />
            case 'neutral':
                return <AlertTriangle size={16} className="text-yellow-600" />
            case 'poor':
                return <XCircle size={16} className="text-red-600" />
            default:
                return <CheckCircle size={16} className="text-gray-600" />
        }
    }

    const getTagColor = (tag: string) => {
        switch (tag) {
            case 'Good Line':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'Needs Work':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'Must Fix':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-[#231b1a] mb-4">Top Problematic Lines</h3>
            <Accordion type="single" collapsible className="space-y-3">
                {lineData.map((line: any) => (
                    <AccordionItem key={line.lineNumber} value={`line-${line.lineNumber}`} className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 sm:px-6 hover:no-underline">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-base gap-2 sm:gap-0 w-full">
                                <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                                    <MessageSquare size={20} className="text-[#9c3313] flex-shrink-0" />
                                    <span className="font-medium text-[#231b1a] text-sm sm:text-base break-words">
                                        Line {line.lineNumber}: "{line.text}"
                                    </span>
                                    <span className="text-xs text-[#7c6f6b] ml-2">
                                        {line.timestamp}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge className={`${getTagColor(line.tag)} text-xs`}>
                                        {line.tag}
                                    </Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="space-y-4">
                                {/* AI Suggestion */}
                                <div className="bg-gradient-to-r from-[#d94010]/10 to-[#9c3313]/10 p-3 sm:p-4 rounded-lg border border-[#d94010]/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="text-[#9c3313]" size={16} />
                                        <span className="font-medium text-[#231b1a] text-sm sm:text-base">Problem:</span>
                                    </div>
                                    <p className="text-[#7c6f6b] text-sm mb-3 break-words">{line.problem}</p>

                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="text-[#9c3313]" size={16} />
                                        <span className="font-medium text-[#231b1a] text-sm sm:text-base">Suggested Alternative:</span>
                                    </div>
                                    <p className="text-[#7c6f6b] text-sm mb-3 break-words">{line.suggestion}</p>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleRewritten(line.lineNumber)}
                                        className="border-[#9c3313] text-[#9c3313] hover:bg-[#9c3313] hover:text-white text-xs sm:text-sm"
                                    >
                                        {showRewritten.includes(line.lineNumber) ? (
                                            <>
                                                <EyeOff size={14} className="mr-1" />
                                                Hide Rewritten
                                            </>
                                        ) : (
                                            <>
                                                <Eye size={14} className="mr-1" />
                                                Show Rewritten
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Rewritten Version */}
                                {showRewritten.includes(line.lineNumber) && (
                                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border-l-4 border-[#9c3313]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium text-[#231b1a]">Suggested Alternative:</span>
                                        </div>
                                        <p className="text-[#7c6f6b] text-sm italic break-words">
                                            "{line.suggestion}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default LineByLineBreakdown 