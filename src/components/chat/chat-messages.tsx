"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChatAvatar } from "./chat-avatar";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const LoadingIndicator = () => (
  <div className="flex items-center space-x-2">
    <div className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:-0.3s]" />
    <div className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:-0.15s]" />
    <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
  </div>
);

const MemoizedReactMarkdown = React.memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);


export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollableContainerRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied!",
        description: "The message has been copied to your clipboard.",
      });
  };

  React.useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollableContainerRef} className="h-full space-y-6 overflow-y-auto p-4 md:p-6">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "group relative flex items-start gap-4",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && <ChatAvatar role="assistant" />}
            <div
              className={cn(
                "max-w-2xl rounded-xl px-4 py-3 shadow-md",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground"
              )}
            >
              {message.image && (
                <div className="relative mb-2 aspect-video h-48">
                    <Image
                      src={message.image}
                      alt="User upload"
                      fill
                      className="rounded-lg object-cover"
                      data-ai-hint="user upload"
                    />
                </div>
              )}
               <MemoizedReactMarkdown
                className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-a:text-accent-foreground prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:text-muted-foreground prose-code:rounded-md prose-code:px-1.5 prose-code:py-1"
                remarkPlugins={[remarkGfm]}
                >
                {message.content}
                </MemoizedReactMarkdown>
            </div>
             {message.role === "assistant" && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleCopy(message.content)}
              >
                <Copy size={16} />
              </Button>
            )}
            {message.role === "user" && <ChatAvatar role="user" />}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4"
          >
            <ChatAvatar role="assistant" />
            <div className="rounded-xl bg-card px-4 py-3 shadow-md">
              <LoadingIndicator />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
