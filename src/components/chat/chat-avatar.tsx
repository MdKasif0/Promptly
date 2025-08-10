"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatAvatarProps {
  role: "user" | "assistant";
}

export function ChatAvatar({ role }: ChatAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8", 
      role === 'user' 
        ? 'bg-primary/20 text-primary' 
        : 'bg-gradient-to-tr from-purple-500 to-blue-500 text-white'
    )}>
      <AvatarFallback className="bg-transparent">
        {role === "user" ? (
          <User className="h-5 w-5" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
