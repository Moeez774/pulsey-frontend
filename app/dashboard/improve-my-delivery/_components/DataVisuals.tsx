'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Clock, Brain } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'


interface DataVisualsProps {
    analysisData: any;
}

const DataVisuals: React.FC<DataVisualsProps> = ({ analysisData }) => {
    const wordsPer30s = analysisData?.words_per_30s || [];
    const mostRepeatedWords = analysisData?.most_repeated_words || [];
    const intensityAnalysis = analysisData?.intensity_analysis || [];

    // Transform words per 30s data for chart
    const pacingData = wordsPer30s.map((item: any) => ({
        time: item.start_time,
        words: item.word_count
    }));

    // Transform most repeated words for pie chart
    const keywordData = mostRepeatedWords.map((item: any, index: number) => ({
        name: item.word,
        value: item.count,
        color: [
            '#9c3313', // Brand orange
            '#d94010', // Lighter orange
            '#f97316', // Bright orange
            '#ea580c', // Dark orange
            '#dc2626', // Red
            '#b91c1c', // Dark red
            '#991b1b', // Darker red
            '#7f1d1d', // Darkest red
            '#ef4444', // Light red
            '#f87171'  // Lighter red
        ][index % 10]
    }));

    // Transform intensity analysis for bar chart
    const engagementData = intensityAnalysis.map((item: any, index: number) => ({
        line: `Line ${index + 1}`,
        intensity: item.intensity === 'high' ? 90 : item.intensity === 'medium' ? 60 : 30,
        text: item.line
    }));



    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-[#231b1a] mb-4">Data-Based Visuals</h3>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">

                {/* Engagement Heatmap */}
                <Card className="bg-white shadow-md border border-gray-200 overflow-hidden">
                    <CardHeader className="px-3 sm:px-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <BarChart3 size={20} className="text-[#9c3313]" />
                            <span>Intensity Analysis</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-[#7c6f6b]">Intensity by top 10 lines</span>
                            </div>
                            <div className="h-48 sm:h-64 w-full overflow-hidden" style={{ minWidth: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={engagementData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="line"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value.replace('Line ', 'L')}
                                        />
                                        <Tooltip
                                            formatter={(value: any, name: any, props: any) => [
                                                props.payload.text,
                                                'Intensity'
                                            ]}
                                            labelFormatter={(label) => label}
                                        />
                                        <Bar dataKey="intensity" fill="#9c3313" radius={8} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-[#7c6f6b] text-center">
                                Intensity by line - Higher bars indicate higher engagement
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Pacing Flow Chart */}
                <Card className="bg-white shadow-md border border-gray-200 overflow-hidden">
                    <CardHeader className="px-3 sm:px-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Clock size={20} className="text-[#9c3313]" />
                            <span>Words per 30s</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-[#7c6f6b]">Words per 30 seconds</span>
                                <span className="text-[#7c6f6b]">0-100</span>
                            </div>
                            <div className="h-48 sm:h-64 w-full overflow-hidden" style={{ minWidth: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={pacingData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="time"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <Tooltip
                                            formatter={(value: any, name: any) => [
                                                `${value} words`,
                                                'Word Count'
                                            ]}
                                        />
                                        <Area
                                            dataKey="words"
                                            type="natural"
                                            fill="#9c3313"
                                            fillOpacity={0.4}
                                            stroke="#9c3313"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-[#7c6f6b] text-center">
                                Word count per 30-second intervals
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Keyword Repetition Chart */}
                <Card className="bg-white shadow-md border space-y-0 gap-0 border-gray-200 overflow-hidden">
                    <CardHeader className="px-3 sm:px-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Brain size={20} className="text-[#9c3313]" />
                            <span>Most Repeated Words</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 py-0 sm:px-4">
                        <div className="space-y-4">
                            <div className="h-64 sm:h-80 lg:h-96 w-full overflow-hidden" style={{ minWidth: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={keywordData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value, percent }) =>
                                                `${name}: ${value} (${(percent || 0 * 100).toFixed(1)}%)`
                                            }
                                            outerRadius={80}
                                            innerRadius={40}
                                            fill="#8884d8"
                                            dataKey="value"
                                            paddingAngle={2}
                                        >
                                            {keywordData.map((entry: any, index: number) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    stroke="#ffffff"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: any, name: any) => [
                                                `${name}: ${value} times`,
                                                'Frequency'
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-[#7c6f6b] text-center">
                                Most frequently used words with usage count and percentage
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DataVisuals 