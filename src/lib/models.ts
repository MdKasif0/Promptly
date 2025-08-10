export const MODEL_DATA = {
  reasoning: {
    label: "Reasoning",
    models: [
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        description: "Google's powerful, general-purpose model.",
        capabilities: ["Text", "Logic"],
        provider: "Gemini",
      },
      {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        description: "Anthropic's most intelligent model for complex tasks.",
        capabilities: ["Text", "Logic", "Analysis"],
        provider: "OpenRouter",
      },
    ],
  },
  coding: {
    label: "Coding",
    models: [
      {
        id: "codellama-70b",
        name: "CodeLlama 70B",
        description: "State-of-the-art model for code generation.",
        capabilities: ["Code", "Text"],
        provider: "OpenRouter",
      },
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Google's next-gen model with a large context window.",
        capabilities: ["Code", "Text", "Vision"],
        provider: "Gemini",
      },
    ],
  },
  vision: {
    label: "Vision",
    models: [
      {
        id: "gemini-pro-vision",
        name: "Gemini Pro Vision",
        description: "Google's model for understanding images and text.",
        capabilities: ["Vision", "Text"],
        provider: "Gemini",
      },
      {
        id: "claude-3-haiku",
        name: "Claude 3 Haiku",
        description: "Fastest and most compact model for near-instant responsiveness.",
        capabilities: ["Vision", "Text", "Speed"],
        provider: "OpenRouter",
      },
    ],
  },
  uncensored: {
    label: "Uncensored",
    models: [
      {
        id: "mythomax-l2-13b",
        name: "MythoMax L2 13B",
        description: "A creative writing and roleplaying model.",
        capabilities: ["Creative", "Unfiltered"],
        provider: "OpenRouter",
      },
    ],
  },
  general: {
    label: "General",
    models: [
      {
        id: "mistral-7b-instruct",
        name: "Mistral 7B Instruct",
        description: "A small, efficient model for general tasks.",
        capabilities: ["General", "Fast"],
        provider: "OpenRouter",
      },
    ],
  },
};

export type ModelCategory = keyof typeof MODEL_DATA;
export type Model = typeof MODEL_DATA[ModelCategory]["models"][0];
export type ModelId = Model["id"];

export const ALL_MODELS: Model[] = Object.values(MODEL_DATA).flatMap(
  (category) => category.models
);

export const getModelById = (id: ModelId): Model | undefined => {
  return ALL_MODELS.find((model) => model.id === id);
};
