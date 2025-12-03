import {CopyIcon, CheckIcon, FileIcon, FolderIcon} from "lucide-react"
import {useState,useMemo,useCallback,Fragment} from "react"

import {Button} from "@/components/ui/button"
import { Hint } from "../../components/hint"

import {ResizablePanel,ResizablePanelGroup,ResizableHandle} from "@/components/ui/resizable"
import {Breadcrumb,BreadcrumbItem,BreadcrumbLink,BreadcrumbList,BreadcrumbSeparator} from "@/components/ui/breadcrumb"
import {CodeView} from "./index"
import { convertFilesToTreeItems } from "@/lib/utils"
import { TreeView } from "./tree-view"

type FileCollection = {[path:string]:string}

function getLanguageExtension(filename:string){
    const extension = filename.split(".").pop()?.toLowerCase()
    return extension || "text"
}

interface FileExplorerProps{
    files:FileCollection,
}

export const FileExplorer = ({files}:FileExplorerProps) => {
    const [selectedFiles,setSelectedFiles] = useState<string | null>(()=>{
        const fileKeys = Object.keys(files)
        return fileKeys.length > 0 ? fileKeys[0] : null
    })
    const [copied, setCopied] = useState(false)
    
    const treeData = useMemo(()=>{
        return convertFilesToTreeItems(files)
    },[files])

    const handleFileSelect = useCallback((filePath:string)=>{
        if(files[filePath]){
            setSelectedFiles(filePath)
        }
    },[files])

    const handleCopyCode = useCallback(() => {
        if (!selectedFiles || !files[selectedFiles]) return
        navigator.clipboard.writeText(files[selectedFiles])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [selectedFiles, files])

    // Create breadcrumb items from file path
    const getBreadcrumbItems = useCallback((filePath: string) => {
        const parts = filePath.split('/').filter(Boolean)
        return parts.map((part, index) => {
            const isLast = index === parts.length - 1
            return {
                name: part,
                path: parts.slice(0, index + 1).join('/'),
                isLast
            }
        })
    }, [])

   return(
    <div className="h-full w-full absolute inset-0 bg-black flex">
        <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={28} minSize={20} className="h-full overflow-hidden">
                {/* Tree view - matching home page style */}
                <div className="h-full bg-[rgba(15,15,20,0.55)] backdrop-blur-md border-r border-white/10 overflow-auto custom-scrollbar">
                    <TreeView value={selectedFiles} data={treeData} onSelect={handleFileSelect} />
                </div>
            </ResizablePanel>
            
            <ResizableHandle 
                withHandle 
                className="bg-white/5 hover:bg-[#1f3dbc]/20 transition-all duration-300 data-[resize-handle-active]:bg-[#1f3dbc]/30"
            />
            
            <ResizablePanel defaultSize={72} minSize={50} className="h-full overflow-hidden">
                {/* Code view area */}
                <div className="h-full w-full bg-[rgba(8,8,10,0.9)] flex flex-col">
                {selectedFiles && files[selectedFiles] ? (
                    <>
                        {/* Header - matching home page style */}
                        <div className="flex-shrink-0 border-b border-white/10 bg-[rgba(15,15,20,0.55)] backdrop-blur-md px-2 py-1.5 flex justify-between items-center gap-x-2">
                            <div className="flex-1 min-w-0">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        {getBreadcrumbItems(selectedFiles).map((item) => (
                                            <Fragment key={item.path}>
                                                <BreadcrumbItem>
                                                    {item.isLast ? (
                                                        <div className="flex items-center gap-1">
                                                            <FileIcon className="w-3 h-3 text-[#1f3dbc]" />
                                                            <span className="text-xs font-medium text-white">
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <BreadcrumbLink 
                                                            className="text-xs text-gray-500 hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-0.5"
                                                            onClick={() => handleFileSelect(item.path)}
                                                        >
                                                            <FolderIcon className="w-2.5 h-2.5" />
                                                            {item.name}
                                                        </BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                                {!item.isLast && <BreadcrumbSeparator className="text-gray-600" />}
                                            </Fragment>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            
                            <Hint text={copied ? "Copied!" : "Copy code"} side="bottom">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={`
                                        size-6 rounded-md border border-white/10 bg-[rgba(31,31,31,0.62)]
                                        hover:bg-white/5 hover:border-white/20 transition-all duration-200
                                        text-gray-400 hover:text-white
                                        ${copied ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}
                                    `}
                                    onClick={handleCopyCode}
                                >
                                    {copied ? (
                                        <CheckIcon className="w-3 h-3" />
                                    ) : (
                                        <CopyIcon className="w-3 h-3" />
                                    )}
                                </Button>
                            </Hint>
                        </div>
                        
                        {/* Code view container */}
                        <div className="flex-1 overflow-auto">
                            <CodeView code={files[selectedFiles]} language={getLanguageExtension(selectedFiles)} />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#1f3dbc]/10 rounded-xl blur-lg"></div>
                            <div className="relative w-12 h-12 bg-[rgba(15,15,20,0.55)] backdrop-blur-md rounded-xl flex items-center justify-center mb-3 border border-white/10 shadow-lg">
                                <FileIcon className="w-6 h-6 text-gray-500" />
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-1 tracking-tight">
                            No File Selected
                        </h3>
                        <p className="text-xs text-gray-500 text-center max-w-xs leading-relaxed">
                            Choose a file from the tree view to see its contents here.
                        </p>
                    </div>
                )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
   )
}