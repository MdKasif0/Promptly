
'use server';

/**
 * @fileOverview Handles API errors by retrying the request with a different tool or model using an LLM to determine the best course of action.
 *
 * - handleApiErrorWithLLM - A function that handles API errors and retries the request.
 * - HandleApiErrorWithLLMInput - The input type for the handleApiErrorWithLLM function.
 * - HandleApiErrorWithLLMOutput - The return type for the handleApiErrorWithLLM function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { type Model } from '@/lib/models';

const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  capabilities: z.array(z.string()),
  provider: z.string(),
});

const HandleApiErrorWithLLMInputSchema = z.object({
  errorMessage: z.string().describe('The error message received from the API.'),
  originalPrompt: z.string().describe('The original prompt that caused the error.'),
  availableModels: z.array(ModelSchema).describe('The list of available models to retry with.'),
  currentModel: z.string().optional().describe('The ID of the current model being used, if any'),
});
export type HandleApiErrorWithLLMInput = z.infer<typeof HandleApiErrorWithLLMInputSchema>;

const HandleApiErrorWithLLMOutputSchema = z.object({
  shouldRetry: z.boolean().describe('Whether the request should be retried.'),
  newModel: z.string().optional().describe('The model ID to use for the retry, if any.'),
  updatedPrompt: z.string().optional().describe('The updated prompt to use for the retry, if any.'),
  reason: z.string().describe('Reason for the retry decision.'),
});
export type HandleApiErrorWithLLMOutput = z.infer<typeof HandleApiErrorWithLLMOutputSchema>;


const prompt = ai.definePrompt({
  name: 'handleApiErrorWithLLMPrompt',
  input: {schema: HandleApiErrorWithLLMInputSchema},
  output: {schema: HandleApiErrorWithLLMOutputSchema},
  prompt: `You are an AI assistant responsible for handling API errors and determining if a request should be retried with a different model or an updated prompt. You are interacting with the OpenRouter API.

You received the following error message: "{{errorMessage}}"

The original prompt was: "{{originalPrompt}}"

The available models are:
{{#each availableModels}}
- Name: {{name}} (ID: {{id}}) - Description: {{description}}
{{/each}}

Here's how to decide:
1.  **Check for Rate Limits**: If the error message contains phrases like "rate limit", "too many requests", or "quota exceeded", set 'shouldRetry' to false and explain that the user has hit a rate limit.
2.  **Analyze the Error**: If it's not a rate limit, analyze the error. Is it related to the model's capabilities (e.g., trying to use a non-vision model for an image)? Is the prompt unclear or malformed?
3.  **Decide to Retry**:
    - If the error seems temporary or fixable by switching models, set 'shouldRetry' to true.
    - If you retry, select a *different* model from the available list that is suitable for the prompt.
    - If you believe the prompt is the issue, you can suggest an 'updatedPrompt'.
    - If no other model seems appropriate or the error is persistent, set 'shouldRetry' to false.

IMPORTANT: If you decide to retry with a new model, you MUST return the 'id' of the model, not its 'name'.

If a model is already specified, consider a different one or updating the prompt. If no model is specified, choose the most appropriate one.

Output your decision in JSON format.
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const handleApiErrorWithLLMFlow = ai.defineFlow(
  {
    name: 'handleApiErrorWithLLMFlow',
    inputSchema: HandleApiErrorWithLLMInputSchema,
    outputSchema: HandleApiErrorWithLLMOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export default handleApiErrorWithLLMFlow;
export const handleApiErrorWithLLM = handleApiErrorWithLLMFlow;
