"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useClerk, useUser } from "@clerk/nextjs";
import { HeroWave } from "@/components/ui/ai-input-hero";
import { logger } from "@/lib/logger";

export default function Home() {
  const router = useRouter();
  const trpc = useTRPC();
  const { user } = useUser();
  const clerk = useClerk();
  
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        logger.error("Failed to create project", error, {
          userId: user?.id,
          errorMessage: error.message,
        });
        
        // User-friendly error message
        const errorMessage = error.message.includes("rate limit")
          ? "You've created too many projects recently. Please try again later."
          : "Failed to create project. Please try again.";
        
        toast.error(errorMessage);
      },
      onSuccess: (data) => {
        logger.info("Project created successfully", {
          projectId: data.id,
          userId: user?.id,
        });
        
        toast.success("Project created! Redirecting...");
        router.push(`/projects/${data.id}`);
      },
    })
  );
  

  const handlePromptSubmit = (value: string) => {
    if (!user) {
      logger.debug("Unauthenticated user attempted to create project");
      return clerk.openSignIn();
    }
    
    if (!value.trim()) {
      toast.error("Please enter a project description");
      return;
    }
    
    logger.info("Creating new project", {
      userId: user.id,
      promptLength: value.length,
    });
    
    createProject.mutate({ value: value });
  }

  return (
    <main className="w-full min-h-screen bg-black overflow-x-hidden">
      <HeroWave 
        onPromptSubmit={handlePromptSubmit}
        buttonText={createProject.isPending ? "Creating..." : "Generate"}
        isLoading={createProject.isPending}
      />
    </main>
  );
}
