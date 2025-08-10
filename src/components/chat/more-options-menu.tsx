"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  File,
  Image as ImageIcon,
  Lightbulb,
  Search,
  BookOpen,
  Sparkles,
  Globe,
  FileText,
  Rocket,
} from "lucide-react";

interface MoreOptionsMenuProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setInput: (input: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const fileOptions = [
  { icon: Camera, text: "Camera" },
  { icon: ImageIcon, text: "Photos" },
  { icon: File, text: "Files" },
];

const advancedOptions = [
  { icon: Lightbulb, text: "Think longer", message: "Think longer about the following topic: "},
  { icon: Rocket, text: "Deep research", message: "Do a deep research on: " },
  { icon: BookOpen, text: "Study and learn", message: "Help me study and learn about: " },
  { icon: Sparkles, text: "Create image", message: "Create an image of: " },
  { icon: Globe, text: "Web search", message: "Search the web for: " },
];

export function MoreOptionsMenu({
  children,
  isOpen,
  setIsOpen,
  setInput,
  fileInputRef,
}: MoreOptionsMenuProps) {
    
  const handleFileOptionClick = (option: string) => {
    if (option === 'Photos' || option === 'Files') {
      fileInputRef.current?.click();
    }
    // Add camera logic here if needed
  };

  const handleAdvancedOptionClick = (message: string) => {
    setInput(message);
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-[#1C1C1E] text-white border-none rounded-t-3xl w-full max-w-3xl mx-auto h-[90vh] flex flex-col p-0"
      >
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-8">
            <div className="grid grid-cols-3 gap-4 mb-6">
            {fileOptions.map((item, index) => (
                <button
                key={index}
                onClick={() => handleFileOptionClick(item.text)}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-800/50 rounded-2xl aspect-square hover:bg-gray-700/80 transition-colors"
                >
                <item.icon size={32} />
                <span className="text-sm font-medium">{item.text}</span>
                </button>
            ))}
            </div>

            <Separator className="bg-gray-700" />

            <div className="mt-6 space-y-2">
            {advancedOptions.map((item, index) => (
                <button
                key={index}
                className="w-full flex items-center gap-4 text-left p-3 rounded-lg hover:bg-gray-800/60"
                onClick={() => handleAdvancedOptionClick(item.message)}
                >
                <item.icon size={22} className="text-gray-400" />
                <span className="text-base">{item.text}</span>
                </button>
            ))}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
