
"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, SendHorizontal, Expand, Check } from "lucide-react";
import Image from 'next/image';
import { getModelById, type ModelId } from "@/lib/models";
import { cn } from "@/lib/utils";
import { MoreOptionsMenu } from "./more-options-menu";
import { useRouter } from 'next/navigation';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (message: string, imageUrl: string | null) => void;
  isLoading: boolean;
  image: string | null;
  setImage: (image: string | null) => void;
  model: ModelId;
}

const SoundWaveIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <path d="M6 10V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M9 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M12 4V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M15 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M18 10V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
)

const GalleryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 4.5H15.5C16.6046 4.5 17.5 5.39543 17.5 6.5V14.5C17.5 15.6046 16.6046 16.5 15.5 16.5H7.5C6.39543 16.5 5.5 15.6046 5.5 14.5V6.5C5.5 5.39543 6.39543 4.5 7.5 4.5Z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 9.5C10.5523 9.5 11 9.05228 11 8.5C11 7.94772 10.5523 7.5 10 7.5C9.44772 7.5 9 7.94772 9 8.5C9 9.05228 9.44772 9.5 10 9.5Z" 
              fill="currentColor"/>
        <path d="M17.5 11.5L14.5 14.5L12 11.5L8 15.5H15.5C16.6046 15.5 17.5 14.6046 17.5 13.5V11.5Z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.5 6.5V18.5C4.5 19.6046 5.39543 20.5 6.5 20.5H18.5" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


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
  const router = useRouter();
  const [isVisionModel, setIsVisionModel] = React.useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const hasInput = input.trim().length > 0 || image !== null;

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
        setIsOptionsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !image) return;
    handleSendMessage(input, image);
    if(isFullScreen) setIsFullScreen(false);
  };

  const handleMicClick = () => {
    router.push('/voice');
  };
  
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input, isFullScreen]);

  React.useEffect(() => {
    if (!isLoading && !isFullScreen) {
      inputRef.current?.focus();
    }
  }, [isLoading, isFullScreen]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && hasInput && !isFullScreen) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col p-4">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 w-full bg-transparent border-none text-lg resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-4">
           <Button variant="ghost" size="icon" className="rounded-full h-12 w-12" onClick={() => setIsFullScreen(false)}>
              <Expand />
           </Button>
           <Button size="lg" className="rounded-full h-12 px-6" onClick={() => setIsFullScreen(false)}>
              <Check className="mr-2 h-5 w-5"/>
              Done
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "flex items-start bg-secondary rounded-2xl transition-all duration-300 p-1.5 gap-1.5"
        )}>
          <MoreOptionsMenu 
            isOpen={isOptionsOpen}
            setIsOpen={setIsOptionsOpen}
            setInput={setInput}
            fileInputRef={fileInputRef}
          >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted"
                onClick={() => setIsOptionsOpen(true)}
                disabled={isLoading}
              >
                <GalleryIcon />
                <span className="sr-only">More options</span>
              </Button>
          </MoreOptionsMenu>
           <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

          <div className="relative w-full flex items-end">
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
              className="bg-transparent border-none rounded-2xl pr-12 pl-2 text-base resize-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none max-h-48 overflow-y-auto"
              rows={1}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            {hasInput && (
                 <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-muted-foreground" onClick={() => setIsFullScreen(true)}>
                    <Expand />
                 </Button>
            )}
            <div className="flex items-center gap-1 self-end">
               <Button type="button" variant="ghost" size="icon" className="rounded-full h-10 w-10" disabled={isLoading}>
                 <Mic className="text-muted-foreground" />
                 <span className="sr-only">Use microphone</span>
               </Button>
                {hasInput ? (
                    <Button type="submit" size="icon" disabled={isLoading} className="rounded-full h-10 w-10 shrink-0 bg-white text-black hover:bg-gray-200">
                        <SendHorizontal className="h-5 w-5" />
                        <span className="sr-only">Send</span>
                    </Button>
                ) : (
                    <Button type="button" size="icon" onClick={handleMicClick} disabled={isLoading} className="rounded-full h-10 w-10 shrink-0 bg-white text-black hover:bg-gray-200">
                        <SoundWaveIcon />
                        <span className="sr-only">Voice Input</span>
                    </Button>
                )}
             </div>
          </div>
        </div>
      </form>
    </div>
  );
}
