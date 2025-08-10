"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image as ImageIcon, Lightbulb, Zap } from "lucide-react";
import { ModelSelector } from "./model-selector";
import type { ModelId } from "@/lib/models";

const exampleMessages = [
  {
    icon: ImageIcon,
    text: "Create an image",
    message: "Create an image of a futuristic city at sunset",
    iconColor: "text-green-500",
  },
  {
    icon: FileText,
    text: "Summarize text",
    message: "Summarize the latest news on AI development.",
    iconColor: "text-orange-500",
  },
  {
    icon: Lightbulb,
    text: "Surprise me",
    message: "Give me a random fun fact.",
    iconColor: "text-cyan-400",
  },
    {
    icon: Zap,
    text: "More",
    message: "What are some other things you can do?",
    iconColor: "text-muted-foreground",
  },
];

interface ChatEmptyScreenProps {
  setInput: (input: string) => void;
  model: ModelId;
  setModel: (modelId: ModelId) => void;
}

export function ChatEmptyScreen({ setInput, model, setModel }: ChatEmptyScreenProps) {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <Card className="w-full max-w-2xl shadow-none border-none bg-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline tracking-tight" style={{ fontFamily: "'Comic Neue', cursive" }}>
            What can I help with?
          </CardTitle>
           <div className="flex justify-center pt-4">
            <ModelSelector model={model} setModel={setModel} />
           </div>
        </CardHeader>
        <CardContent>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {exampleMessages.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto justify-start text-left py-3 px-4 rounded-full border-border/60 hover:bg-muted/50 text-base"
                onClick={() => setInput(item.message)}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={22} className={item.iconColor} />
                  <span>{item.text}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
