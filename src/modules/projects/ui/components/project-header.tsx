import Link from "next/link"
import Image from "next/image"
import { useSuspenseQuery } from "@tanstack/react-query"

import {useTRPC} from "@/trpc/client"
import {Button} from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, SettingsIcon, HomeIcon, FolderIcon, ArrowLeftIcon, SparklesIcon } from "lucide-react"

interface Props{
    projectID:string
}

export const ProjectHeader = ({projectID}:Props) => {
    const trpc = useTRPC()
    const {data:project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id:projectID,
    }))
    
    
    return(
        <header className="px-3 py-2 flex justify-between items-center border-b border-white/10 bg-[rgba(15,15,20,0.55)] backdrop-blur-md">
            <div className="flex items-center gap-2">
                {/* Back Button */}
                <Link href="/">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="size-7 rounded-md border border-white/10 bg-[rgba(31,31,31,0.62)] hover:bg-white/5 hover:border-white/20 transition-all duration-200 text-gray-400 hover:text-white"
                    >
                        <ArrowLeftIcon className="w-3.5 h-3.5" />
                    </Button>
                </Link>

                {/* Logo/Home Link - matching navbar style */}
                <Link href="/" className="flex items-center gap-1.5 group">
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA3Fm3ZqSqSdlph2paINM75OWLtKgBh5mM4w&s" 
                        alt="Lumina Logo" 
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-white/20 transition-all"
                    />
                    <span className="text-gray-200 font-semibold text-xs tracking-tight group-hover:text-white transition-colors">
                        Lumina
                    </span>
                </Link>

                {/* Separator */}
                <div className="h-5 w-px bg-white/10"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            className="relative focus-visible:ring-0 hover:bg-white/5 transition-all duration-200 pl-2 pr-3 h-auto py-1.5 gap-2 group border border-white/10 hover:border-white/20 rounded-full bg-[rgba(31,31,31,0.62)]"
                        >
                            <div className="relative">
                                <Image 
                                    src={process.env.NEXT_PUBLIC_AVATAR_URL || ""} 
                                    alt="Project" 
                                    width={22} 
                                    height={22} 
                                    className="relative rounded-full ring-1 ring-white/10" 
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[1.5px] border-black">
                                    <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-semibold text-white leading-tight line-clamp-1 max-w-[120px]">
                                    {project.name}
                                </span>
                            </div>
                            <ChevronDownIcon className="w-3 h-3 text-gray-500 group-hover:text-white transition-all duration-200" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        side="bottom" 
                        align="start" 
                        className="w-56 p-1.5 bg-[rgba(15,15,20,0.95)] backdrop-blur-xl border-white/10 shadow-2xl rounded-lg text-gray-200"
                        sideOffset={6}
                    >
                        {/* Project Info Header */}
                        <div className="px-2 py-2 mb-1 bg-white/5 rounded-md border border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Image 
                                        src={process.env.NEXT_PUBLIC_AVATAR_URL || ""} 
                                        alt="Project" 
                                        width={28} 
                                        height={28} 
                                        className="relative rounded-full ring-1 ring-white/10" 
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[1.5px] border-[#111]">
                                        <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-xs font-semibold text-white truncate">{project.name}</span>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <SparklesIcon className="w-2.5 h-2.5 text-[#1f3dbc]" />
                                        <span className="text-[10px] text-gray-400">AI Website Builder</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <DropdownMenuItem asChild>
                            <Link href="/" className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md hover:bg-white/5 transition-all duration-200 group focus:bg-white/5 focus:text-white">
                                <div className="p-1 bg-[#1f3dbc]/10 rounded group-hover:bg-[#1f3dbc]/20 transition-colors">
                                    <HomeIcon className="w-3 h-3 text-[#1f3dbc]" />
                                </div>
                                <span className="text-xs font-medium text-gray-300 group-hover:text-white">Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md hover:bg-white/5 transition-all duration-200 group focus:bg-white/5 focus:text-white">
                            <div className="p-1 bg-purple-500/10 rounded group-hover:bg-purple-500/20 transition-colors">
                                <FolderIcon className="w-3 h-3 text-purple-400" />
                            </div>
                            <span className="text-xs font-medium text-gray-300 group-hover:text-white">Project Files</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="my-1 bg-white/10" />
                        
                        <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md hover:bg-white/5 transition-all duration-200 group focus:bg-white/5 focus:text-white">
                            <div className="p-1 bg-gray-500/10 rounded group-hover:bg-gray-500/20 transition-colors">
                                <SettingsIcon className="w-3 h-3 text-gray-400" />
                            </div>
                            <span className="text-xs font-medium text-gray-300 group-hover:text-white">Settings</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}