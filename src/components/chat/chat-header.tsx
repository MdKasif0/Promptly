"use client";

import { ModelSelector } from "./model-selector";
import type { ModelId } from "@/lib/models";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ChatHeaderProps {
  model: ModelId;
  setModel: (modelId: ModelId) => void;
}

export function ChatHeader({ model, setModel }: ChatHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-bold tracking-tight text-primary">AI Chat Spark</h1>
      </div>
      <ModelSelector model={model} setModel={setModel} />
    </div>
  );
}
