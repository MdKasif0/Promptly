"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Send, X } from "lucide-react";
import Image from 'next/image';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (message: string, imageUrl: string | null) => void;
  isLoading: boolean;
  image: string | null;
  setImage: (image: string | null) => void;
}

export function ChatInput({
  input,
  setInput,
  handleSendMessage,
  isLoading,
  image,
  setImage
}: ChatInputProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    <div className="border-t bg-background p-4 md:p-6">
      <form onSubmit={handleSubmit} className="relative">
        {image && (
          <div className="relative mb-2 h-24 w-24">
            <Image src={image} alt="Image preview" layout="fill" objectFit="cover" className="rounded-lg" data-ai-hint="image preview"/>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-muted text-muted-foreground"
              onClick={() => setImage(null)}
            >
              <X size={14} />
            </Button>
          </div>
        )}
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message or upload an image..."
          className="pr-28"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
        />
        <div className="absolute bottom-2.5 right-4 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <ImageIcon className="text-muted-foreground" />
            <span className="sr-only">Upload Image</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !image)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Send />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
