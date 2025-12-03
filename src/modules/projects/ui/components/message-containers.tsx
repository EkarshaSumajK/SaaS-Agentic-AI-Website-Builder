import { useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./messade-card";
import { MessageForm } from "./message-form";
import { Fragment } from "@/generated/prisma";
import { MessageLoading } from "./message-loading";
import { MessageSquareIcon } from "lucide-react";

interface Props {
  projectID: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

const MessageContainers = ({
  projectID,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const trpc = useTRPC();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageRef = useRef<string | null>(null);
  
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({
      projectId: projectID,
    }, { refetchInterval: 5000 })
  );

  useEffect(() => {
    const lastAssignedMessageWithFragments = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );

    if (lastAssignedMessageWithFragments?.fragments && 
        lastAssignedMessageWithFragments.fragments.id !== lastAssistantMessageRef.current) {
      setActiveFragment(lastAssignedMessageWithFragments.fragments);
      lastAssistantMessageRef.current = lastAssignedMessageWithFragments.fragments.id;
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const lastUserMessage = lastMessage?.role === "USER";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      {/* Scrollable messages area */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          minHeight: 0,
        }}
        className="custom-scrollbar"
      >
        <div className="p-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[250px] text-center space-y-3 px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#1f3dbc]/10 rounded-xl blur-lg"></div>
                <div className="relative w-12 h-12 bg-[rgba(15,15,20,0.55)] backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                  <MessageSquareIcon className="w-6 h-6 text-gray-500" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Start Your Conversation
                </h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Send your first message to begin building your AI-powered website.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div key={message.id} className="relative">
                  {activeFragment?.id === message.fragments?.id && (
                    <div className="absolute -inset-1 bg-[#1f3dbc]/5 rounded-xl pointer-events-none"></div>
                  )}
                  <MessageCard
                    content={message.content}
                    fragments={message.fragments}
                    role={message.role}
                    createdAt={message.createdAt}
                    isActive={activeFragment?.id === message.fragments?.id}
                    onFragmentClick={() => setActiveFragment(message.fragments)}
                    type={message.type}
                  />
                </div>
              ))}
              
              {lastUserMessage && <MessageLoading />}
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed message form at bottom */}
      <div className="flex-shrink-0 p-3 border-t border-white/5">
        <MessageForm projectId={projectID} />
      </div>
    </div>
  );
};

export default MessageContainers;
