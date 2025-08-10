"use client";

import { ModelSelector } from "./model-selector";
import type { ModelId } from "@/lib/models";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquarePlus } from "lucide-react";

interface ChatHeaderProps {
  model: ModelId;
  setModel: (modelId: ModelId) => void;
  onNewChat: () => void;
  messages: any[];
}

export function ChatHeader({ model, setModel, onNewChat, messages }: ChatHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between px-4 md:px-6 absolute top-0 left-0 right-0 z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="flex items-center gap-2">
         {messages.length === 0 ? (
           <Button variant="default" size="sm" className="rounded-full bg-primary/90 hover:bg-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Plus
           </Button>
         ) : (
            <ModelSelector model={model} setModel={setModel} />
         )}
      </div>
       <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onNewChat} className="h-8 w-8">
            <MessageSquarePlus size={20} />
          </Button>
      </div>
    </div>
  );
}
