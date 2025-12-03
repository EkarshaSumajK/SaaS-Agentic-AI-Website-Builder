import { Button } from "@/components/ui/button"
import { Fragment, MessageRole, MessageType } from "@/generated/prisma"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { format } from "date-fns"
import { Code2Icon, ChevronRightIcon, SparklesIcon } from "lucide-react"
import Image from "next/image"
interface MessageCardProps{
    content:string
    fragments:Fragment | null
    role:MessageRole
    createdAt:Date
    isActive:boolean
    onFragmentClick:(fragment:Fragment)=>void
    type:MessageType
}
interface UserMessageCardProps{
    content:string
}
const UserMessageCard = ({content}:UserMessageCardProps) => {
    const { user } = useUser();
    return (
        <div className="flex justify-end pb-2 pr-2 pl-8">
            <div className="flex items-start gap-2 max-w-[85%]">
                {/* Message bubble - matching home page input style */}
                <div className="relative rounded-xl p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-black/20">
                    <div className="relative rounded-xl bg-[rgba(15,15,20,0.55)] backdrop-blur-md px-3 py-2 break-words">
                        <p className="text-xs text-white font-medium leading-relaxed whitespace-pre-wrap">
                            {content}
                        </p>
                    </div>
                </div>
                
                <div className="relative flex-shrink-0">
                    <Image 
                        src={user?.imageUrl || ""} 
                        alt="User" 
                        width={24} 
                        height={24} 
                        className="relative rounded-full ring-1 ring-white/10" 
                    />
                </div>
            </div>
        </div>
    )
}
interface AssistantMessageCardProps{
    content:string
    fragments:Fragment | null
    createdAt:Date
    isActive:boolean
    onFragmentClick:(fragment:Fragment)=>void
    type:MessageType
}
interface FragmentCardProps{
    fragments:Fragment
    onFragmentClick:(fragment:Fragment)=>void
    isActive:boolean
}
const FragmentCard = ({fragments,onFragmentClick,isActive}:FragmentCardProps) => {
    return (
        <Button 
            variant="ghost"
            className={cn(
                "relative flex items-center gap-2 rounded-lg w-fit px-2.5 py-2 h-auto transition-all duration-200",
                "max-w-[320px] hover:scale-[1.01] active:scale-[0.99]",
                "bg-[rgba(15,15,20,0.55)] backdrop-blur-md border",
                isActive 
                    ? "border-[#1f3dbc]/50 ring-1 ring-[#1f3dbc]/30" 
                    : "border-white/10 hover:border-white/20 hover:bg-white/5"
            )} 
            onClick={() => onFragmentClick(fragments)}
        >
            <div className={cn(
                "p-1.5 rounded-md flex-shrink-0 transition-all duration-200",
                isActive 
                    ? "bg-[#1f3dbc]/20 text-[#1f3dbc]" 
                    : "bg-white/5 text-gray-400"
            )}>
                <Code2Icon className="size-3.5" />
            </div>
            <div className="flex flex-col flex-1 text-left min-w-0">
                <span className="text-xs font-medium text-white line-clamp-1 leading-tight">
                    {fragments.title}
                </span>
                <span className="text-[10px] text-gray-500">
                    Click to preview
                </span>
            </div>
            <ChevronRightIcon className={cn(
                "size-3.5 flex-shrink-0 transition-all duration-200",
                isActive 
                    ? "text-[#1f3dbc] translate-x-0.5" 
                    : "text-gray-600"
            )} />
        </Button>
    )
}   
const AssistantMessageCard = ({content,fragments,createdAt,isActive,onFragmentClick,type}:AssistantMessageCardProps) => {
    return (
        <div className={cn(
            "flex flex-col px-2 pb-2",
            type === "ERROR" && "text-red-400"
        )}>
            {/* Header with avatar and metadata */}
            <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                    <Image 
                        src="https://avatars.githubusercontent.com/u/143759943?v=4" 
                        alt="Lumina AI" 
                        width={24} 
                        height={24} 
                        className="relative rounded-full ring-1 ring-white/10" 
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">
                            Lumina AI
                        </span>
                        <div className="flex items-center gap-0.5 px-1 py-0.5 bg-[#1f3dbc]/10 text-[#1f3dbc] text-[9px] font-medium rounded">
                            <SparklesIcon className="size-2" />
                            <span>AI</span>
                        </div>
                    </div>
                    <span className="text-[10px] text-gray-500">
                        {format(createdAt, "h:mm a")}
                    </span>
                </div>
            </div>
            
            {/* Content area */}
            <div className="ml-8 flex flex-col gap-2">
                <div className={cn(
                    "relative",
                    type === "ERROR" && "text-red-400"
                )}>
                    <div className="relative rounded-xl p-[1px] bg-gradient-to-br from-white/5 via-transparent to-black/10">
                        <div className="relative bg-[rgba(15,15,20,0.35)] backdrop-blur-sm rounded-xl px-3 py-2">
                            <p className="text-xs leading-relaxed whitespace-pre-wrap text-gray-300 m-0">
                                {content.replace("<task_summary>","").replace("</task_summary>","")}
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Fragment card */}
                {fragments && type === "RESULT" && (
                    <FragmentCard 
                        fragments={fragments} 
                        onFragmentClick={onFragmentClick} 
                        isActive={isActive} 
                    />
                )}
            </div>
        </div>
    )
}
export const MessageCard = ({content,fragments,role,createdAt,isActive,onFragmentClick,type}:MessageCardProps) => {
    if(role==="ASSISTANT"){
        return (
           <AssistantMessageCard content={content} fragments={fragments} createdAt={createdAt} isActive={isActive} onFragmentClick={onFragmentClick} type={type}/>
        )

    }
    return (
        <UserMessageCard content={content} />
    )
}


