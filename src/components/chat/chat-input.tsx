"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Send, Mic, Settings2 } from "lucide-react";
import Image from 'next/image';
import { getModelById, type ModelId } from "@/lib/models";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (message: string, imageUrl: string | null) => void;
  isLoading: boolean;
  image: string | null;
  setImage: (image: string | null) => void;
  model: ModelId;
}

export function ChatInput({
  input,
  setInput,
  handleSendMessage,
  isLoading,
  image,
  setImage,
  model
}: ChatInputProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isVisionModel, setIsVisionModel] = React.useState(false);

  React.useEffect(() => {
    const selectedModel = getModelById(model);
    setIsVisionModel(selectedModel?.capabilities.includes("Vision") || false);
  }, [model]);

  React.useEffect(() => {
    if (!isVisionModel) {
      setImage(null);
    }
  }, [isVisionModel, setImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !image) return;
    handleSendMessage(input, image);
  };
  
  React.useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "flex items-center bg-secondary rounded-full transition-all duration-300",
          image ? "p-2" : "p-0"
        )}>
          {isVisionModel && (
            <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <ImagePlus className="text-muted-foreground" />
              <span className="sr-only">Upload Image</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            </>
          )}
          <div className="relative w-full">
            {image && (
              <div className="absolute left-2 -top-24 h-24 w-24">
                <Image src={image} alt="Image preview" layout="fill" objectFit="cover" className="rounded-lg border-2 border-primary" data-ai-hint="image preview"/>
              </div>
            )}
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="bg-transparent border-none rounded-full pr-24 pl-4 py-3 h-12 text-base resize-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <div className="absolute bottom-1 right-2 flex items-center gap-1">
               <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9" disabled={isLoading}>
                 <Mic className="text-muted-foreground" />
                 <span className="sr-only">Use microphone</span>
               </Button>
               <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9" disabled={isLoading}>
                 <Settings2 className="text-muted-foreground" />
                 <span className="sr-only">Settings</span>
               </Button>
             </div>
          </div>
          <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !image)} className="rounded-full h-10 w-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
            <Send size={18} />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
