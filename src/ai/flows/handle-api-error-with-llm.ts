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
import { ALL_MODELS, type Model } from '@/lib/models';

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
  prompt: `You are an AI assistant responsible for handling API errors and determining if a request should be retried with a different model or an updated prompt.

You received the following error message: "{{errorMessage}}"

The original prompt was: "{{originalPrompt}}"

The available models are:
{{#each availableModels}}
- Name: {{name}} (ID: {{id}}) - Description: {{description}} - Provider: {{provider}}
{{/each}}

Determine if the request should be retried. If so, select a different model from the available models that might be more suitable for the prompt, or suggest an updated prompt if you believe the original prompt was the problem.

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
