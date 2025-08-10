
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Trash2,
  Search,
  Plus,
  Library,
  Sparkles,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Archive as ArchiveIcon,
} from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ChatSidebarProps {
  history: ChatSession[];
  activeChatId: string | null;
  onSwitchChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatSidebar({
  history,
  activeChatId,
  onSwitchChat,
  onNewChat,
  onDeleteChat,
}: ChatSidebarProps) {

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onDeleteChat(chatId);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9 h-10 rounded-full bg-muted border-none focus-visible:ring-primary" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onNewChat} isActive={false} className="h-10">
              <Plus size={16} />
              New chat
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={false} className="h-10">
              <Library size={16} />
              Library
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton isActive={false} className="h-10">
              <Sparkles size={16} />
              GPTs
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton isActive={false} className="h-10">
              <MessageSquare size={16} />
              Chats
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mt-4 px-2 text-sm font-medium text-muted-foreground">
          Recent
        </div>

        <SidebarMenu className="mt-2">
          {history.length > 0 ? (
            history.map((chat) => (
              <SidebarMenuItem key={chat.id} className="group/item">
                <SidebarMenuButton
                  onClick={() => onSwitchChat(chat.id)}
                  isActive={activeChatId === chat.id}
                  className="h-auto py-2 pr-10"
                  tooltip={{
                    children: chat.title,
                    side: "right",
                  }}
                >
                  <MessageSquare size={16} />
                  <div className="flex flex-col items-start truncate text-left">
                    <span className="truncate font-medium">{chat.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </SidebarMenuButton>
                <AlertDialog>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/item:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                           <ArchiveIcon className="mr-2 h-4 w-4" />
                           <span>Archive</span>
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                  </DropdownMenu>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                       Are you sure you want to delete this chat?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        To clear any memories from this chat, visit your{" "}
                         <Link href="#" className="underline">settings</Link>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="!flex-row !justify-center gap-4 pt-4">
                      <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        className="w-full"
                      >
                        Delete
                      </AlertDialogAction>
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
       <SidebarFooter>
        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted">
           <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
               <div className="font-semibold text-sm">Md Kasif Uddin</div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
