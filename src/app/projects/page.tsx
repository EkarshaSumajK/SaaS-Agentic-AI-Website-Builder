"use client";

import React, { useState } from "react";
import { Navbar } from "@/app/(home)/navbar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Globe } from "lucide-react";



export default function ProjectsPage() {
  const trpc = useTRPC();
  const { user } = useUser();
  const listProjects = useQuery(trpc.projects.getMany.queryOptions());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = listProjects.data?.filter((project) => {
    return project.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-[1400px]">
        
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Your Projects
              </h1>
              <p className="text-gray-400 mt-2 text-sm md:text-base">
                Manage and view all your AI-generated websites.
              </p>
            </div>
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <Input 
                placeholder="Search projects..." 
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl h-11 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>


        </div>

        {/* Projects Grid */}
        {listProjects.isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project: { id: string; name: string }) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.id}`}
                className="group flex flex-col bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                {/* Thumbnail Area */}
                <div className="aspect-video w-full bg-neutral-900 relative overflow-hidden group-hover:bg-neutral-800 transition-colors duration-500">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      {/* Browser Header */}
                      <div className="h-6 border-b border-white/5 bg-white/5 flex items-center px-3 gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                      </div>
                      {/* Wireframe Body */}
                      <div className="flex-1 p-3 space-y-3 relative">
                        <div className="h-2 w-1/3 bg-white/10 rounded-full"></div>
                        <div className="flex gap-2">
                           <div className="h-16 w-full bg-white/5 rounded-md border border-white/5"></div>
                           <div className="h-16 w-full bg-white/5 rounded-md border border-white/5"></div>
                        </div>
                        <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                        
                        {/* Accent Gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex gap-2 z-10">
                    <Badge className="bg-black/50 backdrop-blur-md border-white/10 text-white hover:bg-black/70 text-[10px] px-2 py-0.5 h-auto font-normal">
                      Website
                    </Badge>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-base text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[8px] font-bold">
                        {user?.firstName?.charAt(0) || "U"}
                      </div>
                      <span className="text-xs text-gray-500 font-medium truncate max-w-[80px]">
                        {user?.fullName || "User"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                       <div className="flex items-center gap-1 text-[10px]">
                         <Globe className="w-3 h-3" />
                         <span>Public</span>
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 max-w-md mb-8">
              {searchQuery 
                ? `We couldn't find any projects matching "${searchQuery}"`
                : "Get started by creating your first AI-generated website."}
            </p>
            {!searchQuery && (
              <Link href="/">
                <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-8">
                  Create Project
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
