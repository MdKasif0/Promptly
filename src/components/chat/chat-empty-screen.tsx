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
  },
  {
    icon: FileText,
    text: "Summarize text",
    message: "Summarize the latest news on AI development.",
  },
  {
    icon: Lightbulb,
    text: "Surprise me",
    message: "Give me a random fun fact.",
  },
    {
    icon: Zap,
    text: "More",
    message: "What are some other things you can do?",
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
          <CardTitle className="text-4xl font-bold tracking-tight">
            What can I help with?
          </CardTitle>
           <div className="flex justify-center pt-4">
            <ModelSelector model={model} setModel={setModel} />
           </div>
        </CardHeader>
        <CardContent>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exampleMessages.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto justify-start text-left py-3 px-4 rounded-xl border-border/60 hover:bg-muted/50"
                onClick={() => setInput(item.message)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted/80">
                     <item.icon size={18} className="text-foreground/80" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
