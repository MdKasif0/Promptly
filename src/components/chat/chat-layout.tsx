"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "./chat-sidebar";
import { ChatPanel } from "./chat-panel";
import type { ChatSession, Message } from "@/lib/types";
import type { ModelId } from "@/lib/models";

interface ChatLayoutProps {
  chatHistory: ChatSession[];
  activeChatId: string | null;
  onSwitchChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  model: ModelId;
  setModel: (modelId: ModelId) => void;
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (message: string, imageUrl: string | null) => void;
  isLoading: boolean;
  image: string | null;
  setImage: (image: string | null) => void;
}

export function ChatLayout({
  chatHistory,
  activeChatId,
  onSwitchChat,
  onNewChat,
  onDeleteChat,
  ...chatPanelProps
}: ChatLayoutProps) {
  return (
    <SidebarProvider>
      <div className="relative flex h-full w-full max-w-screen-2xl bg-background">
        <ChatSidebar
          history={chatHistory}
          activeChatId={activeChatId}
          onSwitchChat={onSwitchChat}
          onNewChat={onNewChat}
          onDeleteChat={onDeleteChat}
        />
        <ChatPanel {...chatPanelProps} onNewChat={onNewChat} />
      </div>
    </SidebarProvider>
  );
}