export const MODEL_DATA = {
  reasoning: {
    label: "Reasoning",
    models: [
      {
        id: "deepseek/deepseek-r1-0528:free",
        name: "DeepSeek R1 (Reasoning+Code)",
        description: "Great for deep reasoning & coding.",
        capabilities: ["Text", "Logic", "Code"],
        provider: "OpenRouter",
      },
      {
        id: "moonshotai/kimi-k2:free",
        name: "Kimi K2 (Reasoning)",
        description: "Long-context reasoning.",
        capabilities: ["Text", "Logic", "Analysis"],
        provider: "OpenRouter",
      },
      {
        id: "qwen/qwen3-235b-a22b:free",
        name: "Qwen3 235B (Reasoning)",
        description: "Strong reasoning LLM.",
        capabilities: ["Text", "Logic"],
        provider: "OpenRouter",
      },
    ],
  },
  coding: {
    label: "Coding",
    models: [
      {
        id: "qwen/qwen3-coder:free",
        name: "Qwen3 Coder",
        description: "Optimized for code generation.",
        capabilities: ["Code", "Text"],
        provider: "OpenRouter",
      },
      {
        id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        name: "Dolphin Mistral 24B Venice",
        description: "Balanced code + general.",
        capabilities: ["Code", "Text", "General"],
        provider: "OpenRouter",
      },
    ],
  },
  vision: {
    label: "Vision",
    models: [
      {
        id: "meta-llama/llama-3.2-11b-vision-instruct:free",
        name: "LLaMA 3.2 11B Vision",
        description: "Image understanding.",
        capabilities: ["Vision", "Text"],
        provider: "OpenRouter",
      },
    ],
  },
  general: {
    label: "General",
    models: [
      {
        id: "deepseek/deepseek-chat-v3-0324:free",
        name: "DeepSeek Chat v3",
        description: "General purpose.",
        capabilities: ["General"],
        provider: "OpenRouter",
      },
      {
        id: "google/gemma-3-27b-it:free",
        name: "Gemma 3 27B IT",
        description: "Instruction-tuned.",
        capabilities: ["General", "Instruction"],
        provider: "OpenRouter",
      },
      {
        id: "openai/gpt-oss-20b:free",
        name: "GPT-OSS 20B",
        description: "General purpose.",
        capabilities: ["General"],
        provider: "OpenRouter",
      },
      {
        id: "z-ai/glm-4.5-air:free",
        name: "GLM 4.5 Air",
        description: "Fast, general.",
        capabilities: ["General", "Fast"],
        provider: "OpenRouter",
      },
      {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        name: "LLaMA 3.3 70B",
        description: "General large model.",
        capabilities: ["General", "Large"],
        provider: "OpenRouter",
      },
    ],
  },
};

export type ModelCategory = keyof typeof MODEL_DATA;
export type Model = (typeof MODEL_DATA)[ModelCategory]["models"][0];
export type ModelId = Model["id"];

export const ALL_MODELS: Model[] = Object.values(MODEL_DATA).flatMap(
  (category) => category.models
);

export const getModelById = (id: ModelId): Model | undefined => {
  return ALL_MODELS.find((model) => model.id === id);
};
