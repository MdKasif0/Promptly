# **App Name**: AI Chat Spark

## Core Features:

- Chat Interface: Implement a chat interface for users to interact with AI models, displaying user messages and AI responses in a visually appealing, scrollable format.
- Model Selector: Create a dropdown menu for selecting AI models, grouped by categories like Reasoning, Coding, Vision, Uncensored, and General. Add hover tooltips to display model descriptions and capabilities.
- Persistent Chat History: Enable persistent chat history by saving conversations in the browser's localStorage, allowing users to resume previous chats.
- Image Upload for Vision Models: Incorporate an image upload option to allow users to send images to AI models that support vision-based tasks; the model will use this image to reason about a good response.
- Loading Indicator: Use a loading indicator or animation to clearly show when the AI is processing a request and generating a response.
- Error Handling with LLM Tool: Implement robust error handling to gracefully manage failed API calls and provide informative error messages to the user, and automatically retry a failed request using a different tool or model.
- Start New Chat: Add a button or function to clear the current chat and start a new conversation thread, while preserving the existing chat history.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) for a sophisticated and modern feel.
- Background color: Off-black (#121212) to create a dark, immersive environment.
- Accent color: Electric Green (#00FF00) to highlight interactive elements and calls to action, like the send button and model selection.
- Body and headline font: 'Inter' (sans-serif) for a modern, clean, and readable interface.
- Use minimalist, line-based icons for actions like sending messages, uploading images, and starting new chats.
- Employ a responsive layout to ensure seamless usability on devices of all sizes.
- Incorporate subtle animations, such as a smooth transition when displaying new messages or a pulsating loading indicator.