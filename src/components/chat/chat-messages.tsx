"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, Volume2, RotateCw, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";
import { ChatAvatar } from "./chat-avatar";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const LoadingIndicator = () => (
  <div className="flex items-center space-x-2">
    <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:-0.3s]" />
    <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:-0.15s]" />
    <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
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
        setTimeout(() => {
             scrollableContainerRef.current!.scrollTop = scrollableContainerRef.current!.scrollHeight;
        }, 100);
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollableContainerRef} className="h-full space-y-8 overflow-y-auto px-4 pt-20 pb-28">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "group relative flex w-full",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div className={cn(
              "flex flex-col gap-2 max-w-[80%]", 
              message.role === "user" ? "items-end" : "items-start"
            )}>
                <div
                  className={cn(
                    "relative prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-a:text-accent-foreground prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:text-muted-foreground prose-code:rounded-md prose-code:px-1.5 prose-code:py-1",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-3xl px-4 py-3"
                      : "bg-transparent text-card-foreground"
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
                   <MemoizedReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                    </MemoizedReactMarkdown>
                </div>
                 {message.role === "assistant" && (
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(message.content)}>
                        <Copy size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ThumbsUp size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ThumbsDown size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Volume2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <RotateCw size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Share2 size={16} />
                      </Button>
                   </div>
                )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <ChatAvatar role="assistant" />
            <div className="rounded-xl bg-card px-4 py-3">
              <LoadingIndicator />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
