'use client'
import React, { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Sector } from 'recharts';
import { TrendingUp, Eye, Clock, ThumbsUp, Info } from 'lucide-react';

const AnalyticsCard = ({ title, icon, value, description, color }: { title: string, icon: React.ReactNode, value: string, description: string, color: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card className='gap-0 rounded-3xl'>
            <CardHeader className="flex flex-col">
                {icon}
                <CardTitle className="text-[13px] mt-1 font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className='h-fit'>
                <div className="text-2xl font-bold text-[#231b1a]">{value}</div>
                <p className="text-xs mt-2 text-[#5b5b5b]">{description}</p>
            </CardContent>
        </Card>
    )
}

export default function Analytics() {
    const { analytics, analyticsLoading } = useAuth();
    const [selectedWeek, setSelectedWeek] = useState('current');

    const chartData = useMemo(() => {
        if (!analytics?.rows) {
            return [];
        }

        const allData = analytics.rows.map((row, index) => {
            const data: any = {};
            analytics.columnHeaders.forEach((header, headerIndex) => {
                const value = row[headerIndex];
                // Ensure numeric values are properly handled
                if (['likes', 'comments', 'shares', 'views', 'averageViewDuration'].includes(header.name)) {
                    data[header.name] = typeof value === 'number' ? Math.max(0, value) : 0;
                } else {
                    data[header.name] = value;
                }
            });
            return data;
        });

        let filteredData;
        if (selectedWeek === 'current') {
            filteredData = allData.slice(-7)
        } else if (selectedWeek === 'previous') {
            filteredData = allData.slice(-14, -7);
        } else {
            filteredData = allData.slice(-14);
        }

        if (filteredData.length === 0) {
            return [
                { day: new Date().toISOString().split('T')[0], likes: 0, comments: 0, shares: 0, views: 0, averageViewDuration: 0, noData: 1 }
            ];
        }

        console.log('Chart data:', filteredData);
        return filteredData;
    }, [analytics, selectedWeek]);

    const totalViews = useMemo(() => {
        return chartData.reduce((sum, item) => sum + (item.views || 0), 0);
    }, [chartData]);

    const totalLikes = useMemo(() => {
        return chartData.reduce((sum, item) => sum + (item.likes || 0), 0);
    }, [chartData]);

    const totalComments = useMemo(() => {
        return chartData.reduce((sum, item) => sum + (item.comments || 0), 0);
    }, [chartData]);

    const totalShares = useMemo(() => {
        return chartData.reduce((sum, item) => sum + (item.shares || 0), 0);
    }, [chartData]);

    const avgViewDuration = useMemo(() => {
        const total = chartData.reduce((sum, item) => sum + (item.averageViewDuration || 0), 0);
        return total / chartData.length || 0;
    }, [chartData]);

    const engagementData = useMemo(() => {
        const data = [
            { name: 'Likes', value: totalLikes, color: '#9c3313' },
            { name: 'Comments', value: totalComments, color: '#d94010' },
            { name: 'Shares', value: totalShares, color: '#5f2716' },
        ].filter(item => item.value > 0);

        if (data.length === 0) {
            return [
                { name: 'No Data', value: 1, color: '#e5e7eb' }
            ];
        }

        return data;
    }, [totalLikes, totalComments, totalShares]);

    if (analyticsLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-[180px] animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                            </CardHeader>
                            <CardContent className='h-fit'>
                                <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-500">Loading analytics...</div>
                </div>
            </div>
        );
    }

    if (!analytics || !chartData.length || (analytics && analytics.rows && analytics.rows.length === 0)) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className='flex flex-col gap-1'>
                        <h2 className="text-2xl font-bold text-[#231b1a]">Analytics</h2>
                        <p className='text-xs text-[#7c6f6b] flex gap-1'><Info className='translate-y-[1px]' size={14} />Based on YouTube API Data, Visualized by Pulsey</p>
                    </div>
                    <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                        <SelectTrigger className="w-[180px] border-2 text-[#9c3313] border-[#9c3313] rounded-full">
                            <SelectValue className='text-[#9c3313]' placeholder="Select week" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="current">This Week</SelectItem>
                            <SelectItem value="previous">Previous Week</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-center py-12">
                    <div className="text-lg text-[#5b5b5b] mb-2">No analytics data available</div>
                    <div className="text-sm text-[#9c3313]">Analytics data will appear here once your channel has activity</div>
                </div>
            </div>
        );
    }

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toFixed(0)}s`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className='flex flex-col gap-1'>
                    <h2 className="text-2xl font-bold text-[#231b1a]">Analytics</h2>
                    <p className='text-xs text-[#7c6f6b] flex gap-1'>Based on YouTube API Data, Visualized by Pulsey
                    </p>
                </div>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="current">This Week</SelectItem>
                        <SelectItem value="previous">Previous Week</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <AnalyticsCard title="Total Views" icon={<Eye size={18} className="text-[#9c3313]" />} value={formatNumber(totalViews)} description="Last 7 days" color="#9c3313" />

                <AnalyticsCard title="Total Likes" icon={<ThumbsUp size={18} className="text-[#d94010]" />} value={formatNumber(totalLikes)} description="Last 7 days" color="#d94010" />

                <AnalyticsCard title="Avg View Duration" icon={<Clock size={18} className="text-[#5f2716]" />} value={formatDuration(avgViewDuration)} description="Per video" color="#5f2716" />

                <AnalyticsCard title="Total Engagement" icon={<TrendingUp size={18} className="text-[#9c3313]" />} value={formatNumber(totalLikes + totalComments + totalShares)} description="Likes + Comments + Shares" color="#9c3313" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex items-center space-y-0 sm:flex-row">
                        <div className="grid flex-1 gap-1">
                            <CardTitle className="text-lg font-semibold text-[#231b1a]">Views Trend</CardTitle>
                            <CardDescription>Daily view count over the last 7 days</CardDescription>
                            <p className='text-xs text-[#7c6f6b] flex gap-1'><Info className='translate-y-[1px]' size={14} />Based on YouTube API Data, Visualized by Pulsey</p>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-0 pr-2 pt-4 sm:pr-6 sm:pt-6">
                        <div className="aspect-auto h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="#d94010"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#d94010"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="#f3e9e7" />
                                    <XAxis
                                        dataKey="day"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        stroke="#5b5b5b"
                                        fontSize={12}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        stroke="#5b5b5b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #f3e9e7',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value: any) => [formatNumber(value), 'Views']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Area
                                        type="natural"
                                        dataKey="views"
                                        fill="url(#fillViews)"
                                        stroke="#d94010"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader className="items-center pb-0">
                        <CardTitle className="text-lg font-semibold text-[#231b1a]">Engagement Breakdown</CardTitle>
                        <CardDescription>Distribution of likes, comments, and shares</CardDescription>
                        <p className='text-xs text-[#7c6f6b] flex gap-1'><Info className='translate-y-[1px]' size={14} />Based on YouTube API Data, Visualized by Pulsey</p>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <div className="mx-auto aspect-square max-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #f3e9e7',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            padding: '10px',
                                        }}
                                        formatter={(value: any) => [formatNumber(value), 'Count']}
                                    />
                                    <Pie
                                        data={engagementData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        strokeWidth={5}
                                        {...(engagementData.length > 1 && {
                                            activeIndex: 0,
                                            activeShape: ({
                                                outerRadius = 0,
                                                ...props
                                            }: any) => (
                                                <Sector {...props} outerRadius={outerRadius + 10} />
                                            )
                                        })}
                                    >
                                        {engagementData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2 leading-none font-medium text-[#9c3313]">
                            {parseInt(formatNumber(totalLikes + totalComments + totalShares)) > 0 ? (
                                <>
                                    Total engagement: {formatNumber(totalLikes + totalComments + totalShares)} <TrendingUp className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    No engagement data available <TrendingUp className="h-4 w-4" />
                                </>
                            )}
                        </div>
                        <div className="text-[#5b5b5b] text-center leading-none">
                            {engagementData.length > 0
                                ? <div className='flex flex-wrap items-center gap-2'>
                                    <div className='flex gap-2 flex-wrap'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-[#9c3313]'></div>
                                            <p>Likes</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-[#d94010]'></div>
                                            <p>Comments</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-[#5f2716]'></div>
                                            <p>Shares</p>
                                        </div>
                                    </div>
                                </div>
                                : "Engagement data will appear here once your content receives interactions"
                            }
                        </div>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-[#231b1a]">Daily Engagement</CardTitle>
                        <CardDescription>Likes, comments, and shares per day</CardDescription>
                        <p className='text-xs text-[#7c6f6b] flex gap-1'><Info className='translate-y-[1px]' size={14} />Based on YouTube API Data, Visualized by Pulsey</p>
                    </CardHeader>
                    <CardContent className='pl-0 pr-2 sm:pr-6'>
                        <div className="aspect-auto h-[250px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid vertical={false} stroke="#f3e9e7" />
                                    <XAxis
                                        dataKey="day"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        stroke="#5b5b5b"
                                        fontSize={12}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        stroke="#5b5b5b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #f3e9e7',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value: any, name: any) => {
                                            if (value === null || value === undefined || value === 0) return [null, null];
                                            return [formatNumber(Math.abs(value)), name];
                                        }}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                        cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar
                                        dataKey="likes"
                                        stackId="a"
                                        fill="#9c3313"
                                        radius={[0, 0, 4, 4]}
                                    />
                                    <Bar
                                        dataKey="comments"
                                        stackId="a"
                                        fill="#d94010"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="shares"
                                        stackId="a"
                                        fill="#5f2716"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                            {chartData.every(item => (!item.likes || item.likes === 0) && (!item.comments || item.comments === 0) && (!item.shares || item.shares === 0)) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-lg font-medium text-[#9c3313] mb-1">No Data</div>
                                        <div className="text-sm text-[#5b5b5b]">Engagement data will appear here</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 leading-none font-medium text-[#9c3313]">
                            {chartData.some(item => (item.likes && item.likes > 0) || (item.comments && item.comments > 0) || (item.shares && item.shares > 0)) ? (
                                <>
                                    Total engagement: {formatNumber(totalLikes + totalComments + totalShares)} <TrendingUp className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    No engagement data <TrendingUp className="h-4 w-4" />
                                </>
                            )}
                        </div>
                        <div className="text-[#5b5b5b] leading-none">
                            {chartData.some(item => (item.likes && item.likes > 0) || (item.comments && item.comments > 0) || (item.shares && item.shares > 0))
                                ? <div className='flex flex-wrap items-center gap-2'>
                                    <div className='flex gap-2 flex-wrap'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-[#9c3313]'></div>
                                            <p>Likes</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-[#d94010]'></div>
                                            <p>Comments</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-[#5f2716]'></div>
                                            <p>Shares</p>
                                        </div>
                                    </div>
                                </div>
                                : "Data will appear here once you have engagement"
                            }
                        </div>
                    </CardFooter>
                </Card>

                <Card className="py-4 sm:py-0">
                    <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
                            <CardTitle className="text-lg font-semibold text-[#231b1a]">View Duration Trend</CardTitle>
                            <CardDescription>Average view duration over time</CardDescription>
                            <p className='text-xs text-[#7c6f6b] flex gap-1'><Info className='translate-y-[1px]' size={14} />Based on YouTube API Data, Visualized by Pulsey</p>
                        </div>
                        <div className="flex">
                            <div className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-8">
                                <span className="text-muted-foreground text-xs">Average Duration</span>
                                <span className="text-lg leading-none font-bold sm:text-3xl text-[#d94010]">
                                    {formatDuration(avgViewDuration)}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-0 pr-2 py-4 sm:pr-6 sm:py-6">
                        <div className="aspect-auto h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} stroke="#f3e9e7" />
                                    <XAxis
                                        dataKey="day"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        stroke="#5b5b5b"
                                        fontSize={12}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        stroke="#5b5b5b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #f3e9e7',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value: any) => [formatDuration(value), 'Duration']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Line
                                        dataKey="averageViewDuration"
                                        type="monotone"
                                        stroke="#d94010"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
} 