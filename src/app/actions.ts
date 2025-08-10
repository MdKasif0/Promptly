"use server";

import { handleApiErrorWithLLM } from "@/ai/flows/handle-api-error-with-llm";
import { ALL_MODELS } from "@/lib/models";
import type { Message } from "@/lib/types";

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

export async function sendMessageAction(payload: SendMessagePayload): Promise<ActionResult> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 1 in 4 chance of failure to test the error handling
  const shouldFail = Math.random() < 0.25;

  if (shouldFail) {
    const errorMessage = `Simulated API Error: Model '${payload.model}' is currently unavailable or experiencing high traffic.`;
    try {
      const decision = await handleApiErrorWithLLM({
        errorMessage: errorMessage,
        originalPrompt: payload.message,
        availableModels: ALL_MODELS.map((m) => m.id),
        currentModel: payload.model,
      });

      if (decision.shouldRetry) {
        const retryModel = decision.newModel || payload.model;
        const retryPrompt = decision.updatedPrompt || payload.message;
        
        // Simulate a successful retry call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        let response = `(Retried with  модель ${retryModel}) AI response to: "${retryPrompt}"`;
        if (payload.image) {
          response += " with an image.";
        }
        return { success: true, message: response, };
      } else {
        return {
          success: false,
          error: `AI decided not to retry. Reason: ${decision.reason}`,
        };
      }
    } catch (e) {
      console.error(e);
      return {
        success: false,
        error: "An error occurred while using the AI error handler.",
      };
    }
  }

  // Successful response
  let response = `AI response to: "${payload.message}"`;
  if (payload.image) {
    response += " with the provided image.";
  }
  return { success: true, message: response };
}
