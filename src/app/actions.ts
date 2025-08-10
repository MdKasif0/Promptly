
"use server";

import { generate } from "genkit";
import handleApiErrorWithLLM, { type HandleApiErrorWithLLMInput } from "@/ai/flows/handle-api-error-with-llm";
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

  const modelId = modelInfo.provider === "Gemini" ? `googleai/${modelInfo.id}` : modelInfo.id;
  
  const historyParts: Part[] = payload.history.flatMap(
    (msg): Part[] => {
      const parts: Part[] = [{ text: msg.content }];
      if (msg.image) {
        parts.push({ media: { url: msg.image } });
      }
      return msg.role === 'user' 
        ? [{ role: 'user', parts }]
        : [{ role: 'model', parts }];
    }
  );

  const messageParts: Part[] = [{ text: payload.message }];
  if (payload.image) {
    messageParts.push({ media: { url: payload.image } });
  }

  const getConfig = (provider: string) => {
    if (provider === "OpenRouter") {
      return {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
      };
    }
    if (provider === "Gemini") {
      return {
        apiKey: process.env.GEMINI_API_KEY,
      };
    }
    return undefined;
  };
  
  try {
    const response = await generate({
      model: modelId,
      prompt: {
        messages: [
          // @ts-ignore
          ...historyParts,
          { role: "user", parts: messageParts },
        ],
      },
      config: getConfig(modelInfo.provider)
    });

    const aiResponse = response.text();
    return { success: true, message: aiResponse };

  } catch (err: any) {
    console.error("API call failed:", err.message);

    if (isRateLimitError(err.message)) {
        return {
            success: false,
            error: `You've hit the rate limit for ${modelInfo.name}. Please try again later or select a different model.`
        }
    }

    try {
      const decision = await handleApiErrorWithLLM({
        errorMessage: err.message,
        originalPrompt: payload.message,
        availableModels: ALL_MODELS,
        currentModel: payload.model,
      });

      if (decision.shouldRetry && decision.newModel) {
        const retryModelInfo = getModelById(decision.newModel as ModelId);
        if (!retryModelInfo) {
          return { success: false, error: `AI tried to use a model that doesn't exist: ${decision.newModel}. Please try again.` };
        }
        
        const retryModelId = retryModelInfo.provider === "Gemini" ? `googleai/${retryModelInfo.id}` : retryModelInfo.id;
        const retryPrompt = decision.updatedPrompt || payload.message;
        const retryMessageParts: Part[] = [{ text: retryPrompt }];
        if (payload.image) {
            retryMessageParts.push({ media: { url: payload.image } });
        }

        const retryResponse = await generate({
            model: retryModelId,
            prompt: {
              messages: [
                // @ts-ignore
                ...historyParts,
                { role: "user", parts: retryMessageParts },
              ],
            },
            config: getConfig(retryModelInfo.provider),
          });

        const aiResponse = retryResponse.text();
        return { success: true, message: `(Retried with ${retryModelInfo.name}) ${aiResponse}` };

      } else {
        return {
          success: false,
          error: `The AI decided not to retry. Reason: ${decision.reason}`,
        };
      }
    } catch (e: any) {
      console.error(e);
      return {
        success: false,
        error: `An unexpected error occurred. The AI error handler failed with: ${e.message}`,
      };
    }
  }
}
