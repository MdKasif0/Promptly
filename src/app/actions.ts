
"use server";

import type { Message } from "@/lib/types";
import { ElevenLabsClient } from "elevenlabs";

interface SendMessagePayload {
  message: string;
  image: string | null;
  model: string;
  history: Message[];
}

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

const getErrorMessage = (err: any): string => {
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (err.message) return err.message;
  if (err.error?.message) return err.error.message;
  if (typeof err === 'object') {
    try {
      const stringified = JSON.stringify(err, null, 2);
      if (stringified !== '{}') return stringified;
    } catch {
      // fallback
    }
  }
  return "An unknown error occurred.";
};

export async function sendMessageAction(
  payload: SendMessagePayload
): Promise<ActionResult> {
  if (!payload.model) {
    return { success: false, error: "Model not selected. Please select a model to start." };
  }
  
  const history = payload.history.map(msg => {
    const content = [{ type: "text", text: msg.content }];
    if (msg.image) {
      content.push({ type: "image_url", image_url: { url: msg.image } });
    }
    return { role: msg.role, content };
  });

  const userMessageContent = [{ type: "text", text: payload.message }];
  if (payload.image) {
    userMessageContent.push({ type: "image_url", image_url: { url: payload.image } });
  }

  const messages = [
    ...history,
    { role: "user", content: userMessageContent }
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: payload.model,
        messages: messages,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
        return { success: false, error: "The AI did not return a response. Please try again." };
    }

    return { success: true, message: aiResponse };

  } catch (err: any) {
    console.error("API call failed:", err);
    const errorMessage = getErrorMessage(err);
    return {
      success: false,
      error: `An unexpected error occurred: ${errorMessage}`,
    };
  }
}

export async function voiceConversationAction(
  prevState: any,
  formData: FormData
) {
  const audio = formData.get("audio");

  if (!audio || !(audio instanceof Blob)) {
    return { error: "No audio data received." };
  }

  try {
    const elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const stream = await elevenlabs.agents.speak({
      agentId: process.env.ELEVENLABS_AGENT_ID!,
      audio: audio as Blob,
      stream: true,
      model: "deepseek/deepseek-chat-v3-0324:free",
      openRouterApiKey: process.env.OPENROUTER_API_KEY,
    });
    
    const chunks = [];
    for await (const chunk of stream) {
      if (chunk.audio) {
          chunks.push(chunk.audio);
      }
    }

    const blob = new Blob(chunks, { type: "audio/mpeg" });
    const dataUrl = `data:audio/mpeg;base64,${Buffer.from(await blob.arrayBuffer()).toString('base64')}`;
    
    return { audio: dataUrl };
  } catch (error) {
    console.error("ElevenLabs API Error:", error);
    const errorMessage = getErrorMessage(error);
    return { error: `An error occurred during the voice conversation: ${errorMessage}` };
  }
}
