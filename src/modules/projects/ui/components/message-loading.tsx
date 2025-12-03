"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { 
  SparklesIcon, 
  Loader2Icon, 
  SearchIcon,
  ListTreeIcon,
  PackageIcon,
  FileCodeIcon,
  CheckCircle2Icon,
  BrainCircuitIcon,
  WrenchIcon,
  RocketIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Status stages that mirror the prompt.ts STATUS_TYPES
const PROGRESS_STAGES = [
  {
    id: "analyzing",
    label: "Analyzing",
    description: "Understanding your request...",
    icon: SearchIcon,
    duration: 3000,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "planning", 
    label: "Planning",
    description: "Designing component architecture...",
    icon: ListTreeIcon,
    duration: 4000,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "installing",
    label: "Installing",
    description: "Setting up dependencies...",
    icon: PackageIcon,
    duration: 3000,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "creating",
    label: "Creating",
    description: "Building components & pages...",
    icon: FileCodeIcon,
    duration: 8000,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "optimizing",
    label: "Optimizing",
    description: "Polishing the code...",
    icon: WrenchIcon,
    duration: 4000,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: "finalizing",
    label: "Finalizing",
    description: "Almost ready...",
    icon: RocketIcon,
    duration: 5000,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
];

interface ProgressStage {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: number;
  color: string;
  bgColor: string;
}

const ProgressIndicator = ({ 
  stage, 
  isActive, 
  isComplete,
  index 
}: { 
  stage: ProgressStage; 
  isActive: boolean; 
  isComplete: boolean;
  index: number;
}) => {
  const Icon = stage.icon;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-500",
        isActive && "bg-white/5 scale-100",
        isComplete && "opacity-60",
        !isActive && !isComplete && "opacity-30"
      )}
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className={cn(
        "relative flex items-center justify-center w-5 h-5 rounded-md transition-all duration-300",
        isActive ? stage.bgColor : isComplete ? "bg-emerald-500/10" : "bg-white/5"
      )}>
        {isComplete ? (
          <CheckCircle2Icon className="w-3 h-3 text-emerald-400" />
        ) : isActive ? (
          <>
            <Icon className={cn("w-3 h-3", stage.color)} />
            <div className={cn(
              "absolute inset-0 rounded-md animate-ping opacity-30",
              stage.bgColor
            )} />
          </>
        ) : (
          <Icon className="w-3 h-3 text-gray-600" />
        )}
      </div>
      
      <div className="flex flex-col min-w-0">
        <span className={cn(
          "text-[10px] font-medium transition-colors duration-300",
          isActive ? stage.color : isComplete ? "text-gray-400" : "text-gray-600"
        )}>
          {stage.label}
        </span>
      </div>
    </div>
  );
};

const ActiveStatusDisplay = ({ stage }: { stage: ProgressStage }) => {
  const Icon = stage.icon;
  const [dots, setDots] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative rounded-xl p-[1px] bg-gradient-to-br from-white/10 via-transparent to-white/5 overflow-hidden">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" 
        style={{ 
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite'
        }} 
      />
      
      <div className="relative bg-[rgba(15,15,20,0.65)] backdrop-blur-sm rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Icon with glow */}
          <div className={cn("relative flex items-center justify-center", stage.bgColor, "w-8 h-8 rounded-lg")}>
            <div className={cn("absolute inset-0 rounded-lg blur-md", stage.bgColor, "opacity-50")} />
            <Icon className={cn("relative w-4 h-4", stage.color)} />
          </div>
          
          {/* Status text */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-semibold", stage.color)}>
                {stage.label}
              </span>
              <Loader2Icon className={cn("w-3 h-3 animate-spin", stage.color)} />
            </div>
            <span className="text-[11px] text-gray-400">
              {stage.description.replace("...", "")}{dots}
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", stage.color.replace("text-", "bg-"))}
            style={{ 
              width: '100%',
              animation: `progress ${stage.duration}ms ease-out forwards`
            }}
          />
        </div>
      </div>
    </div>
  );
};

const CodePreviewSkeleton = () => (
  <div className="mt-3 p-3 bg-black/30 rounded-lg border border-white/5 overflow-hidden">
    <div className="flex items-center gap-2 mb-2">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
      </div>
      <div className="h-2 w-20 bg-white/10 rounded animate-pulse" />
    </div>
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="h-2 w-8 bg-purple-500/20 rounded" />
        <div className="h-2 w-24 bg-blue-500/20 rounded" />
        <div className="h-2 w-16 bg-white/10 rounded" />
      </div>
      <div className="flex gap-2 pl-4">
        <div className="h-2 w-12 bg-emerald-500/20 rounded" />
        <div className="h-2 w-20 bg-white/10 rounded" />
      </div>
      <div className="flex gap-2 pl-4">
        <div className="h-2 w-16 bg-amber-500/20 rounded" />
        <div className="h-2 w-28 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="flex gap-2 pl-4">
        <div className="h-2 w-10 bg-cyan-500/20 rounded" />
        <div className="h-2 w-16 bg-white/10 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-2 w-6 bg-purple-500/20 rounded" />
      </div>
    </div>
  </div>
);

export const MessageLoading = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const currentStage = PROGRESS_STAGES[currentStageIndex];
  
  // Progress through stages automatically
  useEffect(() => {
    let totalElapsed = 0;
    let stageIndex = 0;
    
    const interval = setInterval(() => {
      totalElapsed += 1000;
      setElapsedTime(totalElapsed);
      
      // Calculate which stage we should be on
      let accumulated = 0;
      for (let i = 0; i < PROGRESS_STAGES.length; i++) {
        accumulated += PROGRESS_STAGES[i].duration;
        if (totalElapsed < accumulated) {
          if (i !== stageIndex) {
            setCompletedStages(prev => new Set([...prev, stageIndex]));
            stageIndex = i;
            setCurrentStageIndex(i);
          }
          break;
        }
        // If we've passed all stages, stay on the last one
        if (i === PROGRESS_STAGES.length - 1 && totalElapsed >= accumulated) {
          setCompletedStages(prev => new Set([...prev, ...Array.from({length: i}, (_, idx) => idx)]));
          stageIndex = i;
          setCurrentStageIndex(i);
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatElapsed = useCallback((ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }, []);
  
  return (
    <div className="flex flex-col px-2 pb-2">
      {/* Header with avatar and metadata */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <Image
            src="https://avatars.githubusercontent.com/u/143759943?v=4"
            alt="Lumina AI"
            width={28}
            height={28}
            className="relative rounded-full ring-2 ring-[#1f3dbc]/30"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#1f3dbc] rounded-full flex items-center justify-center">
            <BrainCircuitIcon className="w-2 h-2 text-white animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">
              Lumina AI
            </span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#1f3dbc]/15 border border-[#1f3dbc]/20 text-[#1f3dbc] text-[9px] font-medium rounded-full">
              <SparklesIcon className="size-2.5 animate-pulse" />
              <span>Building</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500">
              {format(new Date(), "h:mm a")}
            </span>
            <span className="text-[9px] text-gray-600">•</span>
            <span className="text-[9px] text-gray-500">
              {formatElapsed(elapsedTime)} elapsed
            </span>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="ml-9 flex flex-col gap-3">
        {/* Progress stages - horizontal pills */}
        <div className="flex flex-wrap gap-1">
          {PROGRESS_STAGES.map((stage, index) => (
            <ProgressIndicator
              key={stage.id}
              stage={stage}
              isActive={index === currentStageIndex}
              isComplete={completedStages.has(index)}
              index={index}
            />
          ))}
        </div>
        
        {/* Active status display */}
        <ActiveStatusDisplay stage={currentStage} />
        
        {/* Code preview skeleton (appears during creating/optimizing phases) */}
        {(currentStage.id === "creating" || currentStage.id === "optimizing") && (
          <CodePreviewSkeleton />
        )}
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};
