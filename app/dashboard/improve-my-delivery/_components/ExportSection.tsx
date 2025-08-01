'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'

interface ExportSectionProps {
    analysisData?: any;
    transcript?: string;
}

const ExportSection: React.FC<ExportSectionProps> = ({ analysisData, transcript }) => {
    const generatePDF = async () => {
        try {
            toast.loading('Generating PDF report...', { id: 'pdf-generation' })

            const pdf = new jsPDF('p', 'mm', 'a4')
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            let yPosition = 20

            pdf.setFontSize(24)
            pdf.setFont('helvetica', 'bold')
            pdf.setTextColor(35, 27, 26)
            pdf.text('Improve My Delivery - Analysis Report', pageWidth / 2, yPosition, { align: 'center' })
            yPosition += 15

            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'normal')
            pdf.setTextColor(124, 111, 107)
            pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' })
            yPosition += 20

            // Overall Analysis Summary
            if (analysisData?.overall_summary) {
                pdf.setFontSize(18)
                pdf.setFont('helvetica', 'bold')
                pdf.setTextColor(35, 27, 26)
                pdf.text('Overall Analysis Summary', 20, yPosition)
                yPosition += 10

                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(60, 60, 60)

                const summary = analysisData.overall_summary
                const summaryItems = [
                    { label: 'Delivery Style', value: summary.delivery_style || 'Not analyzed' },
                    { label: 'Pacing', value: summary.pacing || 'Not analyzed' },
                    { label: 'Hook Quality', value: summary.hook_quality || 'Not analyzed' },
                    { label: 'Clarity', value: summary.clarity || 'Not analyzed' },
                    { label: 'Emotion Level', value: summary.emotion_level || 'Not analyzed' },
                    { label: 'Call to Action', value: summary.call_to_action || 'Not analyzed' },
                    { label: 'Retention Risk', value: summary.retention_risk || 'Not analyzed' }
                ]

                summaryItems.forEach(item => {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage()
                        yPosition = 20
                    }

                    pdf.setFont('helvetica', 'bold')
                    pdf.text(`${item.label}:`, 20, yPosition)
                    yPosition += 6

                    pdf.setFont('helvetica', 'normal')
                    const valueLines = pdf.splitTextToSize(item.value, pageWidth - 50)
                    for (const line of valueLines) {
                        if (yPosition > pageHeight - 30) {
                            pdf.addPage()
                            yPosition = 20
                        }
                        pdf.text(line, 25, yPosition)
                        yPosition += 6
                    }
                    yPosition += 3
                })
                yPosition += 10
            }

            // Overall Analysis (if exists)
            if (analysisData?.overall_analysis) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage()
                    yPosition = 20
                }

                pdf.setFontSize(18)
                pdf.setFont('helvetica', 'bold')
                pdf.setTextColor(35, 27, 26)
                pdf.text('Overall Analysis', 20, yPosition)
                yPosition += 10

                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(60, 60, 60)

                const overallText = analysisData.overall_analysis
                const overallLines = pdf.splitTextToSize(overallText, pageWidth - 40)

                for (const line of overallLines) {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage()
                        yPosition = 20
                    }
                    pdf.text(line, 20, yPosition)
                    yPosition += 6
                }
                yPosition += 10
            }

            // Highlights & Pain Points
            if (analysisData?.highlights && analysisData.highlights.length > 0) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage()
                    yPosition = 20
                }

                pdf.setFontSize(16)
                pdf.setFont('helvetica', 'bold')
                pdf.setTextColor(35, 27, 26)
                pdf.text('Highlights', 20, yPosition)
                yPosition += 10

                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(60, 60, 60)

                analysisData.highlights.forEach((highlight: string, index: number) => {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage()
                        yPosition = 20
                    }
                    const highlightText = `• ${highlight}`
                    const highlightLines = pdf.splitTextToSize(highlightText, pageWidth - 40)

                    for (const line of highlightLines) {
                        if (yPosition > pageHeight - 30) {
                            pdf.addPage()
                            yPosition = 20
                        }
                        pdf.text(line, 20, yPosition)
                        yPosition += 6
                    }
                    yPosition += 3
                })
                yPosition += 10
            }

            if (analysisData?.pain_points && analysisData.pain_points.length > 0) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage()
                    yPosition = 20
                }

                pdf.setFontSize(16)
                pdf.setFont('helvetica', 'bold')
                pdf.setTextColor(35, 27, 26)
                pdf.text('Pain Points', 20, yPosition)
                yPosition += 10

                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(60, 60, 60)

                analysisData.pain_points.forEach((painPoint: string, index: number) => {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage()
                        yPosition = 20
                    }
                    const painPointText = `• ${painPoint}`
                    const painPointLines = pdf.splitTextToSize(painPointText, pageWidth - 40)

                    for (const line of painPointLines) {
                        if (yPosition > pageHeight - 30) {
                            pdf.addPage()
                            yPosition = 20
                        }
                        pdf.text(line, 20, yPosition)
                        yPosition += 6
                    }
                    yPosition += 3
                })
                yPosition += 10
            }

            // Key Insights (if exists)
            if (analysisData?.key_insights && analysisData.key_insights.length > 0) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage()
                    yPosition = 20
                }

                pdf.setFontSize(16)
                pdf.setFont('helvetica', 'bold')
                pdf.setTextColor(35, 27, 26)
                pdf.text('Key Insights', 20, yPosition)
                yPosition += 10

                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(60, 60, 60)

                analysisData.key_insights.forEach((insight: string, index: number) => {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage()
                        yPosition = 20
                    }
                    const insightText = `${index + 1}. ${insight}`
                    const insightLines = pdf.splitTextToSize(insightText, pageWidth - 40)

                    for (const line of insightLines) {
                        if (yPosition > pageHeight - 30) {
                            pdf.addPage()
                            yPosition = 20
                        }
                        pdf.text(line, 20, yPosition)
                        yPosition += 6
                    }
                    yPosition += 5
                })
                yPosition += 10
            }

            if (analysisData?.top_bad_lines && analysisData.top_bad_lines.length > 0) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage()
                    yPosition = 20
                }

                pdf.setFontSize(16)
                pdf.setFont('helvetica', 'bold')
                pdf.setTextColor(35, 27, 26)
                pdf.text('Top Problematic Lines', 20, yPosition)
                yPosition += 10

                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(60, 60, 60)

                analysisData.top_bad_lines.slice(0, 5).forEach((line: any, index: number) => {
                    if (yPosition > pageHeight - 40) {
                        pdf.addPage()
                        yPosition = 20
                    }

                    pdf.setFont('helvetica', 'bold')
                    pdf.text(`Line ${index + 1}:`, 20, yPosition)
                    yPosition += 6

                    pdf.setFont('helvetica', 'normal')
                    const lineText = `"${line.line}"`
                    const lineLines = pdf.splitTextToSize(lineText, pageWidth - 40)

                    for (const textLine of lineLines) {
                        if (yPosition > pageHeight - 30) {
                            pdf.addPage()
                            yPosition = 20
                        }
                        pdf.text(textLine, 25, yPosition)
                        yPosition += 6
                    }

                    if (line.problem) {
                        yPosition += 3
                        pdf.setFont('helvetica', 'bold')
                        pdf.setTextColor(156, 51, 19)
                        pdf.text('Problem:', 25, yPosition)
                        yPosition += 6

                        pdf.setFont('helvetica', 'normal')
                        pdf.setTextColor(60, 60, 60)
                        const problemLines = pdf.splitTextToSize(line.problem, pageWidth - 50)

                        for (const problemLine of problemLines) {
                            if (yPosition > pageHeight - 30) {
                                pdf.addPage()
                                yPosition = 20
                            }
                            pdf.text(problemLine, 30, yPosition)
                            yPosition += 6
                        }
                    }

                    // Suggestion
                    if (line.suggested_alternative) {
                        yPosition += 3
                        pdf.setFont('helvetica', 'bold')
                        pdf.setTextColor(156, 51, 19)
                        pdf.text('Suggestion:', 25, yPosition)
                        yPosition += 6

                        pdf.setFont('helvetica', 'normal')
                        pdf.setTextColor(60, 60, 60)
                        const suggestionLines = pdf.splitTextToSize(line.suggested_alternative, pageWidth - 50)

                        for (const suggestionLine of suggestionLines) {
                            if (yPosition > pageHeight - 30) {
                                pdf.addPage()
                                yPosition = 20
                            }
                            pdf.text(suggestionLine, 30, yPosition)
                            yPosition += 6
                        }
                    }

                    yPosition += 10
                })
            }

            // Data Visuals Summary
            if (analysisData?.words_per_30s || analysisData?.most_repeated_words || analysisData?.intensity_analysis) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage()
                    yPosition = 20
                }

                pdf.setFontSize(16)
                pdf.setFont('helvetica', 'bold')
                pdf.setTextColor(35, 27, 26)
                pdf.text('Data Analysis Summary', 20, yPosition)
                yPosition += 10

                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(60, 60, 60)

                // Words per 30s summary
                if (analysisData?.words_per_30s && analysisData.words_per_30s.length > 0) {
                    pdf.setFont('helvetica', 'bold')
                    pdf.text('Pacing Analysis (Words per 30s):', 20, yPosition)
                    yPosition += 6

                    pdf.setFont('helvetica', 'normal')
                    const pacingData = analysisData.words_per_30s.slice(0, 5) // Show first 5 entries
                    pacingData.forEach((item: any, index: number) => {
                        if (yPosition > pageHeight - 30) {
                            pdf.addPage()
                            yPosition = 20
                        }
                        pdf.text(`• ${item.start_time}: ${item.word_count} words`, 25, yPosition)
                        yPosition += 6
                    })
                    yPosition += 5
                }

                // Most repeated words
                if (analysisData?.most_repeated_words && analysisData.most_repeated_words.length > 0) {
                    pdf.setFont('helvetica', 'bold')
                    pdf.text('Most Repeated Words:', 20, yPosition)
                    yPosition += 6

                    pdf.setFont('helvetica', 'normal')
                    const repeatedWords = analysisData.most_repeated_words.slice(0, 10) // Show top 10
                    repeatedWords.forEach((item: any, index: number) => {
                        if (yPosition > pageHeight - 30) {
                            pdf.addPage()
                            yPosition = 20
                        }
                        pdf.text(`• "${item.word}": ${item.count} times`, 25, yPosition)
                        yPosition += 6
                    })
                    yPosition += 5
                }

                // Intensity analysis
                if (analysisData?.intensity_analysis && analysisData.intensity_analysis.length > 0) {
                    pdf.setFont('helvetica', 'bold')
                    pdf.text('Intensity Analysis (Top Lines):', 20, yPosition)
                    yPosition += 6

                    pdf.setFont('helvetica', 'normal')
                    const intensityData = analysisData.intensity_analysis.slice(0, 5) // Show top 5
                    intensityData.forEach((item: any, index: number) => {
                        if (yPosition > pageHeight - 30) {
                            pdf.addPage()
                            yPosition = 20
                        }
                        pdf.text(`• Line ${index + 1}: ${item.intensity} intensity`, 25, yPosition)
                        yPosition += 6
                    })
                    yPosition += 5
                }
                yPosition += 10
            }

            // Statistics Section
            if (analysisData?.statistics) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage()
                    yPosition = 20
                }

                pdf.setFontSize(16)
                pdf.setFont('helvetica', 'bold')
                pdf.setTextColor(35, 27, 26)
                pdf.text('Analysis Statistics', 20, yPosition)
                yPosition += 10

                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(60, 60, 60)

                const stats = analysisData.statistics
                const statItems = [
                    { label: 'Total Words', value: stats.total_words || 'N/A' },
                    { label: 'Average Words per Minute', value: stats.avg_wpm || 'N/A' },
                    { label: 'Speaking Duration', value: stats.speaking_duration || 'N/A' },
                    { label: 'Problematic Lines', value: stats.problematic_lines || 'N/A' },
                    { label: 'Clarity Score', value: stats.clarity_score || 'N/A' },
                    { label: 'Engagement Score', value: stats.engagement_score || 'N/A' }
                ]

                statItems.forEach(item => {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage()
                        yPosition = 20
                    }
                    pdf.text(`${item.label}: ${item.value}`, 20, yPosition)
                    yPosition += 8
                })
            }

            // Transcript Section (if available)
            if (transcript) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage()
                    yPosition = 20
                }

                pdf.setFontSize(16)
                pdf.setFont('helvetica', 'bold')
                pdf.setTextColor(35, 27, 26)
                pdf.text('Original Transcript', 20, yPosition)
                yPosition += 10

                pdf.setFontSize(10)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(60, 60, 60)

                const transcriptLines = pdf.splitTextToSize(transcript, pageWidth - 40)

                for (const line of transcriptLines) {
                    if (yPosition > pageHeight - 20) {
                        pdf.addPage()
                        yPosition = 20
                    }
                    pdf.text(line, 20, yPosition)
                    yPosition += 5
                }
            }

            // Footer
            const totalPages = pdf.getNumberOfPages()
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i)
                pdf.setFontSize(10)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(124, 111, 107)
                pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
                pdf.text('Generated by Pulsey AI', pageWidth - 20, pageHeight - 10, { align: 'right' })
            }

            // Save the PDF
            const fileName = `delivery-analysis-${new Date().toISOString().split('T')[0]}.pdf`
            pdf.save(fileName)

            toast.success('PDF report downloaded successfully!', { id: 'pdf-generation' })
        } catch (error) {
            console.error('PDF generation error:', error)
            toast.error('Failed to generate PDF report', { id: 'pdf-generation' })
        }
    }

    const handleDownloadReport = () => {
        generatePDF()
    }

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-[#231b1a] mb-4">Export / Save Analysis</h3>
            <Card className="bg-white p-0 gap-0 shadow-md border border-gray-200 overflow-hidden">
                <CardHeader className="p-3 sm:px-4">
                    <CardTitle className="text-base sm:text-lg text-[#231b1a]">Save Your Analysis</CardTitle>
                </CardHeader>
                <CardContent className='pb-3 sm:pb-4'>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Button
                            onClick={handleDownloadReport}
                            className="flex-1 bg-[#9c3313] hover:bg-[#d94010] text-white py-3 rounded-xl font-semibold transition-colors duration-200 text-sm sm:text-base"
                        >
                            <Download size={16} className="mr-2" />
                            <span className="whitespace-nowrap">Download Full Report as PDF</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ExportSection 