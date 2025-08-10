"use client";

import * as React from "react";
import { nanoid } from "nanoid";
import { ChatLayout } from "@/components/chat/chat-layout";
import type { Message, ChatSession } from "@/lib/types";
import { sendMessageAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { ALL_MODELS, type ModelId } from "@/lib/models";

export default function ChatPage() {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [chatHistory, setChatHistory] = React.useState<ChatSession[]>([]);
  const [model, setModel] = React.useState<ModelId>("gemini-pro");
  const [isLoading, setIsLoading] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [image, setImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("chatHistory");
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
      const savedActiveChatId = localStorage.getItem("activeChatId");
      if (savedActiveChatId) {
        setActiveChatId(JSON.parse(savedActiveChatId));
      }
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [chatHistory]);

  React.useEffect(() => {
    try {
      if (activeChatId) {
        localStorage.setItem("activeChatId", JSON.stringify(activeChatId));
        const activeChat = chatHistory.find((chat) => chat.id === activeChatId);
        setMessages(activeChat?.messages || []);
        setModel(activeChat?.modelId || "gemini-pro");
      } else {
        setMessages([]);
        localStorage.removeItem("activeChatId");
      }
    } catch (e) {
      console.error("Failed to manage active chat", e);
    }
  }, [activeChatId, chatHistory]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    setChatHistory((prevHistory) =>
      prevHistory.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages: [...chat.messages, message] } : chat
      )
    );
  };

  const handleSendMessage = async (messageContent: string, imageUrl: string | null) => {
    if (isLoading) return;

    const newUserMessage: Message = {
      id: nanoid(),
      role: "user",
      content: messageContent,
      image: imageUrl || undefined,
    };

    let currentChatId = activeChatId;

    if (!currentChatId) {
      const newChatId = nanoid();
      const newChatSession: ChatSession = {
        id: newChatId,
        title: messageContent.substring(0, 30),
        messages: [newUserMessage],
        modelId: model,
        createdAt: new Date().toISOString(),
      };
      setChatHistory((prev) => [newChatSession, ...prev]);
      setActiveChatId(newChatId);
      setMessages([newUserMessage]);
      currentChatId = newChatId;
    } else {
       addMessage(newUserMessage);
    }

    setIsLoading(true);

    try {
      const { success, message: aiResponse, error } = await sendMessageAction({
        message: messageContent,
        image: imageUrl,
        model: model,
        history: messages,
      });

      if (success && aiResponse) {
        const newAiMessage: Message = {
          id: nanoid(),
          role: "assistant",
          content: aiResponse,
        };
        addMessage(newAiMessage);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "An unknown error occurred.",
        });
        // Remove user message on error to allow retry
         setMessages(prev => prev.slice(0, -1));
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      // Remove user message on error to allow retry
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setInput("");
      setImage(null);
    }
  };
  
  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setModel("gemini-pro");
  };

  const switchChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  return (
    <main className="flex h-screen w-full flex-col items-center">
      <ChatLayout
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onSwitchChat={switchChat}
        onNewChat={startNewChat}
        model={model}
        setModel={setModel}
        messages={messages}
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        image={image}
        setImage={setImage}
      />
    </main>
  );
}
