
"use server";

import { generate } from "genkit";
import handleApiErrorWithLLM from "@/ai/flows/handle-api-error-with-llm";
import { ALL_MODELS, getModelById, type ModelId } from "@/lib/models";
import type { Message } from "@/lib/types";
import {Part} from "genkit/content";

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
  if (err.message) return err.message;
  if (err.details) return JSON.stringify(err.details);
  if (err.error?.message) return err.error.message;
  if (typeof err === 'object') {
    try {
      const stringified = JSON.stringify(err, null, 2);
      if (stringified !== '{}') return stringified;
    } catch {
      // fallback
    }
  }
  return String(err);
};


const isRateLimitError = (errorMessage: string): boolean => {
    const lowerCaseError = errorMessage.toLowerCase();
    return lowerCaseError.includes("rate limit") || 
           lowerCaseError.includes("quota") || 
           lowerCaseError.includes("too many requests");
}

export async function sendMessageAction(
  payload: SendMessagePayload
): Promise<ActionResult> {
  const modelInfo = getModelById(payload.model as ModelId);

  if (!modelInfo) {
    return { success: false, error: "Model not found." };
  }
  
  const historyParts: Part[] = payload.history.flatMap((msg): Part[] => {
    const parts: Part[] = [{ text: msg.content }];
    if (msg.image) {
      parts.push({ media: { url: msg.image } });
    }
    return [{ role: msg.role === 'user' ? 'user' : 'model', parts }];
  });

  const messageParts: Part[] = [{ text: payload.message }];
  if (payload.image) {
    messageParts.push({ media: { url: payload.image } });
  }

  const modelId = modelInfo.id;
  
  const config = {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: "https://openrouter.ai/api/v1",
  };
  
  try {
    const response = await generate({
      model: modelId,
      // @ts-ignore
      prompt: {
        messages: [
          ...historyParts,
          { role: "user", parts: messageParts },
        ],
      },
      config: config
    });

    const aiResponse = response.text;
    return { success: true, message: aiResponse };

  } catch (err: any) {
    const errorMessage = getErrorMessage(err);
    console.error("API call failed:", errorMessage);

    if (isRateLimitError(errorMessage)) {
        return {
            success: false,
            error: `You've hit the rate limit for ${modelInfo.name}. Please try again later or select a different model.`
        }
    }

    try {
      const decision = await handleApiErrorWithLLM({
        errorMessage: errorMessage,
        originalPrompt: payload.message,
        availableModels: ALL_MODELS,
        currentModel: payload.model,
      });

      if (decision.shouldRetry && decision.newModel) {
        const retryModelInfo = getModelById(decision.newModel as ModelId);
        if (!retryModelInfo) {
          return { success: false, error: `AI tried to use a model that doesn't exist: ${decision.newModel}. Please try again.` };
        }
        
        const retryModelId = retryModelInfo.id;
        const retryPrompt = decision.updatedPrompt || payload.message;
        const retryMessageParts: Part[] = [{ text: retryPrompt }];
        if (payload.image) {
            retryMessageParts.push({ media: { url: payload.image } });
        }

        const retryResponse = await generate({
            model: retryModelId,
            // @ts-ignore
            prompt: {
              messages: [
                ...historyParts,
                { role: "user", parts: retryMessageParts },
              ],
            },
            config: config,
          });

        const aiResponse = retryResponse.text;
        return { success: true, message: `(Retried with ${retryModelInfo.name}) ${aiResponse}` };

      } else {
        return {
          success: false,
          error: `The AI decided not to retry. Reason: ${decision.reason}`,
        };
      }
    } catch (e: any) {
      const finalErrorMessage = getErrorMessage(e);
      console.error("AI error handler failed:", finalErrorMessage);
      return {
        success: false,
        error: `An unexpected error occurred. The AI error handler failed with: ${finalErrorMessage}`,
      };
    }
  }
}
