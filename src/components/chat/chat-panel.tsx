"use client";

import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import type { Message } from "@/lib/types";
import type { ModelId } from "@/lib/models";
import { ChatEmptyScreen } from "./chat-empty-screen";

interface ChatPanelProps {
  model: ModelId;
  setModel: (modelId: ModelId) => void;
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (message: string, imageUrl: string | null) => void;
  isLoading: boolean;
  image: string | null;
  setImage: (image: string | null) => void;
}

export function ChatPanel(props: ChatPanelProps) {
  return (
    <div className="flex flex-1 flex-col h-screen">
      <ChatHeader model={props.model} setModel={props.setModel} />
      <div className="flex-1 overflow-y-auto">
        {props.messages.length > 0 ? (
          <ChatMessages messages={props.messages} isLoading={props.isLoading} />
        ) : (
          <ChatEmptyScreen setInput={props.setInput} />
        )}
      </div>
      <ChatInput
        input={props.input}
        setInput={props.setInput}
        handleSendMessage={props.handleSendMessage}
        isLoading={props.isLoading}
        image={props.image}
        setImage={props.setImage}
        model={props.model}
      />
    </div>
  );
}
