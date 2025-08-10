"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNewChat}>
            <PlusSquare size={16} />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {history.length > 0 ? (
            history.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  onClick={() => onSwitchChat(chat.id)}
                  isActive={activeChatId === chat.id}
                  className="h-auto py-2"
                  tooltip={{
                    children: chat.title,
                    side: "right"
                  }}
                >
                  <MessageSquare size={16} />
                  <div className="flex flex-col items-start truncate text-left">
                    <span className="truncate font-medium">{chat.title}</span>
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
