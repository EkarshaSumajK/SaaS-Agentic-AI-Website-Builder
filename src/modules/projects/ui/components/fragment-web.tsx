import { Fragment } from "@/generated/prisma"
import {useState} from "react"
import {ExternalLinkIcon, RefreshCcwIcon, CheckIcon, CopyIcon, GlobeIcon, Loader2Icon} from "lucide-react"
import {Button} from "@/components/ui/button"
import { Hint } from "./hint"

interface Props{
    data:Fragment
}

export const FragmentWeb = ({data}:Props) => {
    const [fragmentKey,setFragmentKey] = useState(0)
    const [copied,setCopied] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    
    const onRefresh = () => {
        setIsRefreshing(true)
        setFragmentKey(prev => prev + 1)
        setTimeout(() => setIsRefreshing(false), 1000)
    }
    
    const handleCopy = () => {
        if(!data.sandboxUrl) return;
        navigator.clipboard.writeText(data.sandboxUrl)
        setCopied(true)
        setTimeout(()=>{
            setCopied(false)
        },2000)
    }
    
    return(
        <div className="flex flex-col w-full h-full relative">
            {/* Header - matching home page style */}
            <div className="relative p-2 border-b border-white/10 bg-[rgba(15,15,20,0.55)] backdrop-blur-md">
                <div className="relative flex items-center gap-x-1.5">
                    {/* Refresh Button */}
                    <Hint text="Refresh preview" side="bottom">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`
                                size-7 rounded-md border border-white/10 bg-[rgba(31,31,31,0.62)]
                                hover:bg-white/5 hover:border-white/20 transition-all duration-200
                                text-gray-400 hover:text-white
                                ${isRefreshing ? 'opacity-50' : ''}
                            `}
                            onClick={onRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCcwIcon className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                    </Hint>
                    
                    {/* URL Display - styled like home page input */}
                    <Hint text={copied ? "Copied!" : "Copy URL"} side="bottom">
                        <Button 
                            variant="ghost" 
                            className={`
                                relative flex-1 justify-start px-2 h-7 rounded-md
                                border border-white/10 bg-[rgba(31,31,31,0.62)]
                                hover:bg-white/5 hover:border-white/20 transition-all duration-200
                                ${copied ? 'bg-emerald-500/10 border-emerald-500/30' : ''}
                            `}
                            disabled={!data.sandboxUrl} 
                            onClick={handleCopy}
                        >
                            <div className="flex items-center gap-1.5 min-w-0">
                                {copied ? (
                                    <CheckIcon className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                ) : (
                                    <CopyIcon className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                )}
                                <span className={`
                                    text-[10px] font-mono truncate
                                    ${copied ? 'text-emerald-400' : 'text-gray-500'}
                                `}>
                                    {data.sandboxUrl || 'No URL available'}
                                </span>
                            </div>
                        </Button>
                    </Hint>

                    {/* External Link Button */}
                    <Hint text="Open in new tab" side="bottom">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="
                                size-7 rounded-md border border-white/10 bg-[rgba(31,31,31,0.62)]
                                hover:bg-white/5 hover:border-white/20 transition-all duration-200
                                text-gray-400 hover:text-white
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                            onClick={()=>{
                                if(!data.sandboxUrl) return;
                                window.open(data.sandboxUrl, "_blank")
                            }} 
                            disabled={!data.sandboxUrl}
                        >
                            <ExternalLinkIcon className="w-3 h-3" />
                        </Button>
                    </Hint>
                </div>
            </div>
            
            {/* Iframe container */}
            <div className="flex-1 relative bg-black">
                {data.sandboxUrl ? (
                    <div className="relative h-full">
                        {/* Loading overlay */}
                        {isRefreshing && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center">
                                <div className="relative bg-[rgba(15,15,20,0.55)] backdrop-blur-md border border-white/10 rounded-lg px-3 py-2">
                                    <div className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <Loader2Icon className="w-3 h-3 text-[#1f3dbc] animate-spin" />
                                        Refreshing...
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <iframe 
                            key={fragmentKey} 
                            src={data.sandboxUrl} 
                            className="w-full h-full border-0 relative z-0 bg-white" 
                            sandbox="allow-forms allow-scripts allow-same-origin" 
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col h-full items-center justify-center p-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#1f3dbc]/10 rounded-xl blur-lg"></div>
                            <div className="relative w-12 h-12 bg-[rgba(15,15,20,0.55)] backdrop-blur-md rounded-xl flex items-center justify-center mb-3 border border-white/10 shadow-lg">
                                <GlobeIcon className="w-6 h-6 text-gray-500" />
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-1 tracking-tight">
                            No Preview URL
                        </h3>
                        <p className="text-xs text-gray-500 text-center max-w-xs leading-relaxed">
                            This fragment doesn&apos;t have a sandbox URL available for preview.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}   