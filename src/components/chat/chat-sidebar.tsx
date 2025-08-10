"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusSquare, MessageSquare } from "lucide-react";
import type { ChatSession } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ChatSidebarProps {
  history: ChatSession[];
  activeChatId: string | null;
  onSwitchChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  history,
  activeChatId,
  onSwitchChat,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">History</h2>
          <SidebarTrigger />
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={onNewChat}>
          <PlusSquare size={16} /> New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {history.length > 0 ? (
            history.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  onClick={() => onSwitchChat(chat.id)}
                  className={cn("truncate", activeChatId === chat.id && "bg-sidebar-accent text-sidebar-accent-foreground")}
                  tooltip={{
                    children: chat.title,
                    side: "right"
                  }}
                >
                  <MessageSquare size={16} />
                  <div className="flex flex-col items-start truncate">
                    <span className="truncate">{chat.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No chat history.
            </div>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
