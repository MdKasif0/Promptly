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
import { PlusSquare, MessageSquare, Trash2 } from "lucide-react";
import type { ChatSession } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    // Placeholder for delete logic
    console.log("Delete chat:", chatId);
  }
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
              <SidebarMenuItem key={chat.id} className="group/item">
                <SidebarMenuButton
                  onClick={() => onSwitchChat(chat.id)}
                  isActive={activeChatId === chat.id}
                  className="h-auto py-2 pr-10"
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
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/item:opacity-100">
                        <Trash2 size={16} />
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this chat session.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={(e) => handleDeleteChat(e, chat.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
