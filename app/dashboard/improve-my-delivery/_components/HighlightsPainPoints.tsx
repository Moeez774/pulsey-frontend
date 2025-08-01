'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle } from 'lucide-react'

interface HighlightsPainPointsProps {
    analysisData: any;
}

const HighlightsPainPoints: React.FC<HighlightsPainPointsProps> = ({ analysisData }) => {
    const highlights = analysisData?.highlights || [];
    const painPoints = analysisData?.pain_points || [];

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-[#231b1a] mb-4">Highlights & Pain Points</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Highlights */}
                <Card className="bg-white shadow-md border border-gray-200 overflow-hidden">
                    <CardHeader className="px-3 sm:px-4">
                        <CardTitle className="flex items-center gap-2 text-green-800 text-base sm:text-lg">
                            <CheckCircle size={20} className="text-green-600" />
                            <span>Highlights</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-4 pt-0">
                        <ul className="space-y-2 sm:space-y-3">
                            {highlights.map((highlight: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-[#7c6f6b] mt-1 text-xs sm:text-sm">•</span>
                                    <span className="text-[#7c6f6b] text-xs sm:text-sm leading-relaxed break-words">
                                        {highlight}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Pain Points */}
                <Card className="bg-white shadow-md border border-gray-200 overflow-hidden">
                    <CardHeader className="px-3 sm:px-4">
                        <CardTitle className="flex items-center gap-2 text-red-800 text-base sm:text-lg">
                            <XCircle size={20} className="text-red-600" />
                            <span>Pain Points</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-4 pt-0">
                        <ul className="space-y-2 sm:space-y-3">
                            {painPoints.map((painPoint: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-[#7c6f6b] mt-1 text-xs sm:text-sm">•</span>
                                    <span className="text-[#7c6f6b] text-xs sm:text-sm leading-relaxed break-words">
                                        {painPoint}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default HighlightsPainPoints 