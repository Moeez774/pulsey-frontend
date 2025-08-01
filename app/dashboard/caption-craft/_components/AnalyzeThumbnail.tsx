"use client";

import React, { useState } from 'react';
import { FaRegImage, FaUpload } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyzeByImg from './AnalyzeComponents/AnalyzeByImg';

interface AnalyzeThumbnailProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const AnalyzeThumbnail: React.FC<AnalyzeThumbnailProps> = ({ isOpen, onOpenChange }) => {
    const [videoUrl, setVideoUrl] = useState('');

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl w-full mx-auto'>
                <DialogHeader>
                    <DialogTitle>Analyze Thumbnail</DialogTitle>
                    <DialogDescription>
                        Upload a thumbnail image to get insights on how to improve it
                    </DialogDescription>
                </DialogHeader>
                <AnalyzeByImg />
            </DialogContent>
        </Dialog>
    );
};

export default AnalyzeThumbnail; 