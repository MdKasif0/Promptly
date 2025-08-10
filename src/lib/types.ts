import type { ModelId } from './models';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  modelId: ModelId;
  messages: Message[];
}
