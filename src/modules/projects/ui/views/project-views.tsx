"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Suspense, useState } from "react"
import MessageContainers from "../components/message-containers"
import { Fragment } from "@/generated/prisma"        
import { ProjectHeader } from "../components/project-header"
import { FragmentWeb } from "../components/fragment-web"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeIcon, EyeIcon, Loader2Icon } from "lucide-react"
import { FileExplorer } from "./code-view/file-explorer"

type FileCollection = { [path: string]: string }

interface Props {
    projectID: string
}

const LoadingCard = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center p-4">
        <div className="bg-[rgba(15,15,20,0.55)] backdrop-blur-md border border-white/10 rounded-lg px-4 py-2.5">
            <div className="text-xs text-gray-400 flex items-center gap-2">
                <Loader2Icon className="w-3 h-3 text-[#1f3dbc] animate-spin" />
                <span>{children}</span>
            </div>
        </div>
    </div>
)

export const ProjectViews = ({ projectID }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")

    return (
        <div className="h-screen w-screen bg-black overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1f3dbc]/5 via-transparent to-transparent" />
            </div>

            {/* Main content */}
            <div className="relative h-full w-full ">
                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/5 via-white/[0.02] to-black/20 p-[1px] overflow-hidden">
                    <div className="h-full w-full bg-[rgba(10,10,12,0.75)] backdrop-blur-xl rounded-2xl overflow-hidden">
                        <ResizablePanelGroup direction="horizontal" style={{ height: '100%' }}>
                            {/* Left Panel - Chat */}
                            <ResizablePanel defaultSize={25} minSize={25}>
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <div className="flex-shrink-0">
                                        <Suspense fallback={<LoadingCard>Loading Project...</LoadingCard>}>
                                            <ProjectHeader projectID={projectID} />
                                        </Suspense>
                                    </div>
                                    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                                        <Suspense fallback={<LoadingCard>Loading Messages...</LoadingCard>}>
                                            <MessageContainers 
                                                projectID={projectID} 
                                                activeFragment={activeFragment} 
                                                setActiveFragment={setActiveFragment} 
                                            />
                                        </Suspense>
                                    </div>
                                </div>
                            </ResizablePanel>

                            <ResizableHandle
                                withHandle
                                className="bg-white/5 hover:bg-[#1f3dbc]/20 transition-all duration-300"
                            />

                            {/* Right Panel - Preview/Code */}
                            <ResizablePanel defaultSize={50} minSize={50}>
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Tabs 
                                        value={activeTab} 
                                        onValueChange={(v) => setActiveTab(v as "preview" | "code")}
                                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    >
                                        {/* Tab Header */}
                                        <div className="flex-shrink-0 flex items-center p-2 border-b border-white/10 bg-[rgba(15,15,20,0.55)]">
                                            <TabsList className="h-7 p-0.5 bg-[rgba(15,15,20,0.55)] border border-white/10 rounded-lg">
                                                <TabsTrigger
                                                    value="preview"
                                                    className="rounded-md px-2.5 py-1 text-gray-400 data-[state=active]:bg-[#f0f2ff] data-[state=active]:text-black"
                                                >
                                                    <EyeIcon className="w-3 h-3 mr-1.5" />
                                                    <span className="text-xs font-medium">Preview</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="code"
                                                    className="rounded-md px-2.5 py-1 text-gray-400 data-[state=active]:bg-[#f0f2ff] data-[state=active]:text-black"
                                                >
                                                    <CodeIcon className="w-3 h-3 mr-1.5" />
                                                    <span className="text-xs font-medium">Code</span>
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        {/* Tab Content */}
                                        <TabsContent value="preview" style={{ flex: 1, minHeight: 0, margin: 0 }}>
                                            <div style={{ height: '100%', width: '100%' }}>
                                                {activeFragment ? (
                                                    <FragmentWeb data={activeFragment} />
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center p-6 bg-[rgba(5,5,8,0.5)]">
                                                        <div className="w-12 h-12 bg-[rgba(15,15,20,0.55)] rounded-xl flex items-center justify-center mb-4 border border-white/10">
                                                            <EyeIcon className="w-6 h-6 text-gray-500" />
                                                        </div>
                                                        <h3 className="text-sm font-semibold text-white mb-1.5">No Preview Available</h3>
                                                        <p className="text-xs text-gray-400 text-center max-w-xs">
                                                            Select a fragment from the conversation to see its live preview.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="code" style={{ flex: 1, minHeight: 0, margin: 0 }}>
                                            <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                                                {activeFragment ? (
                                                    <div style={{ position: 'absolute', inset: 0 }}>
                                                        <FileExplorer files={activeFragment.files as FileCollection} />
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center p-6 bg-[rgba(5,5,8,0.5)]">
                                                        <div className="w-12 h-12 bg-[rgba(15,15,20,0.55)] rounded-xl flex items-center justify-center mb-4 border border-white/10">
                                                            <CodeIcon className="w-6 h-6 text-gray-500" />
                                                        </div>
                                                        <h3 className="text-sm font-semibold text-white mb-1.5">No Code Available</h3>
                                                        <p className="text-xs text-gray-400 text-center max-w-xs">
                                                            Select a fragment from the conversation to explore its code.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </div>
            </div>
        </div>
    )
}
