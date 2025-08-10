"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";

const exampleMessages = [
  {
    heading: "Explain a concept",
    message: "What is the significance of the Schrödinger's cat thought experiment?",
  },
  {
    heading: "Write some code",
    message: "Write a Python script to scrape a website and save the data to a CSV file.",
  },
  {
    heading: "Brainstorm ideas",
    message: "Brainstorm some creative and catchy names for a new tech startup.",
  },
];

interface ChatEmptyScreenProps {
  setInput: (input: string) => void;
}

export function ChatEmptyScreen({ setInput }: ChatEmptyScreenProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-2xl shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Welcome to <span className="text-primary">AI Chat Spark</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {exampleMessages.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto justify-start text-left"
              onClick={() => setInput(item.message)}
            >
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold">{item.heading}</p>
                  <p className="text-sm text-muted-foreground">{item.message}</p>
                </div>
                <CornerDownLeft size={16} className="mt-1 text-muted-foreground" />
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
