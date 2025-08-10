"use client";

import * as React from "react";
import { nanoid } from "nanoid";
import { ChatLayout } from "@/components/chat/chat-layout";
import type { Message, ChatSession } from "@/lib/types";
import { sendMessageAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { getModelById, type ModelId, ALL_MODELS } from "@/lib/models";

export default function ChatPage() {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [chatHistory, setChatHistory] = React.useState<ChatSession[]>([]);
  const [model, setModel] = React.useState<ModelId>("gemini-2.5-flash");
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
      const savedModel = localStorage.getItem("selectedModel");
      if (savedModel && ALL_MODELS.find(m => m.id === JSON.parse(savedModel))) {
        setModel(JSON.parse(savedModel));
      }
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      if (chatHistory.length > 0) {
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      }
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
        if (activeChat?.modelId && ALL_MODELS.find(m => m.id === activeChat.modelId)) {
          setModel(activeChat?.modelId);
        } else {
            setModel("gemini-2.5-flash");
        }
      } else {
        setMessages([]);
        localStorage.removeItem("activeChatId");
      }
    } catch (e) {
      console.error("Failed to manage active chat", e);
    }
  }, [activeChatId, chatHistory]);
  
  const handleSetModel = (newModel: ModelId) => {
    setModel(newModel);
    try {
      localStorage.setItem("selectedModel", JSON.stringify(newModel));
      if (activeChatId) {
        setChatHistory(prev => prev.map(chat => 
          chat.id === activeChatId ? { ...chat, modelId: newModel } : chat
        ));
      }
    } catch(e) {
       console.error("Failed to save model to localStorage", e);
    }
  }

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    if (activeChatId) {
        setChatHistory((prevHistory) => {
            return prevHistory.map((chat) => {
                if (chat.id === activeChatId) {
                    return { ...chat, messages: [...chat.messages, message] };
                }
                return chat;
            });
        });
    }
  };

  const handleSendMessage = async (messageContent: string, imageUrl: string | null) => {
    if (isLoading) return;
    
    const selectedModel = getModelById(model);
    if (imageUrl && !selectedModel?.capabilities.includes("Vision")) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "The selected model does not support image inputs. Please select a vision model.",
        });
        setImage(null);
        return;
    }


    const newUserMessage: Message = {
      id: nanoid(),
      role: "user",
      content: messageContent,
      image: imageUrl || undefined,
    };

    let currentChatId = activeChatId;
    let currentMessages = messages;

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
      currentMessages = [newUserMessage];
      currentChatId = newChatId;
    } else {
       addMessage(newUserMessage);
       currentMessages = [...messages, newUserMessage];
    }

    setIsLoading(true);

    try {
      const { success, message: aiResponse, error } = await sendMessageAction({
        message: messageContent,
        image: imageUrl,
        model: model,
        history: currentMessages.slice(0, -1),
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
         setChatHistory((prevHistory) => {
            const newHistory = prevHistory.map((chat) => {
                if (chat.id === activeChatId) {
                    return { ...chat, messages: chat.messages.slice(0, -1) };
                }
                return chat;
            });
            return newHistory;
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      // Remove user message on error to allow retry
      setMessages(prev => prev.slice(0, -1));
      setChatHistory((prevHistory) => {
        const newHistory = prevHistory.map((chat) => {
            if (chat.id === activeChatId) {
                return { ...chat, messages: chat.messages.slice(0, -1) };
            }
            return chat;
        });
        return newHistory;
    });
    } finally {
      setIsLoading(false);
      setInput("");
      setImage(null);
    }
  };
  
  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setModel("gemini-2.5-flash");
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
        setModel={handleSetModel}
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
