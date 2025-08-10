"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatAvatarProps {
  role: "user" | "assistant";
}

export function ChatAvatar({ role }: ChatAvatarProps) {
  return (
    <Avatar className={cn("h-10 w-10", role === 'user' ? 'bg-primary' : 'bg-card')}>
      <AvatarFallback>
        {role === "user" ? (
          <User className="text-primary-foreground" />
        ) : (
          <Bot className="text-card-foreground" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
