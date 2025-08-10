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
  onNewChat: () => void;
}

export function ChatPanel(props: ChatPanelProps) {
  return (
    <div className="flex flex-col h-screen relative">
      <ChatHeader model={props.model} setModel={props.setModel} onNewChat={props.onNewChat} messages={props.messages}/>
      <div className="flex-1 overflow-y-auto">
        {props.messages.length > 0 ? (
          <ChatMessages messages={props.messages} isLoading={props.isLoading} />
        ) : (
          <ChatEmptyScreen setInput={props.setInput} model={props.model} setModel={props.setModel} />
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 md:left-[16rem] bg-background/80 backdrop-blur-sm flex justify-center">
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
    </div>
  );
}
