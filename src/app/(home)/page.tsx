"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useClerk, useUser } from "@clerk/nextjs";
import { HeroWave } from "@/components/ui/ai-input-hero";

export default function Home() {
  const router = useRouter();
  const trpc = useTRPC();
  const { user } = useUser();
  const clerk = useClerk();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      },
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
    })
  );
  


  const handlePromptSubmit = (value: string) => {
    if(!user) return clerk.openSignIn()
    if(!value.trim()) return
    createProject.mutate({ value: value })
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
