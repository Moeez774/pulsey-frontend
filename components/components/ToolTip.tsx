import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const ToolTip = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
    return (
        <div>
            <Tooltip>
                <TooltipTrigger>
                    {icon}
                </TooltipTrigger>
                <TooltipContent className='bg-[#9c3314] text-center text-[#fefefe] max-w-[200px] w-fit px-2 inter'>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

export default ToolTip