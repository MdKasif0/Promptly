# Promptly: Your Advanced AI Chat Copilot

Welcome to **Promptly**, a modern, high-performance AI chat application designed to provide an intelligent and seamless conversational experience. Built with a powerful tech stack, Promptly offers a premium user interface, multi-model support, and a futuristic voice interface.

This project is bootstrapped with [Firebase Studio](https://firebase.google.com/studio).

![Promptly Screenshot](public/promptly-cover.png?text=Promptly+App)

## ✨ Features

-   **Premium Chat Interface:** A clean, modern, and responsive chat UI designed for a first-class user experience.
-   **Multi-Model Support:** Seamlessly switch between various leading AI models from Google (Gemini) and OpenRouter to find the best fit for your task.
-   **Vision & Image Support:** Upload and discuss images with vision-enabled AI models.
-   **Interactive Voice Page:** A stunning, futuristic voice input page with an interactive particle animation.
-   **Chat History:** Your conversations are automatically saved to your browser's local storage.
-   **SEO Optimized:** Built with a solid SEO foundation to improve search engine visibility.
-   **Error Handling with AI:** Intelligently retries failed API calls with a different model or prompt.

## 🚀 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **AI/Generative:** [Google Genkit](https://firebase.google.com/docs/genkit)
-   **UI:** [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
-   **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 🔧 Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your API keys:
    ```env
    # Required for Google Gemini models
    GEMINI_API_KEY=your_gemini_api_key

    # Optional: Required for models from OpenRouter
    OPENROUTER_API_KEY=your_openrouter_api_key
    ```

4.  **Run the development server:**
    The application runs on two parallel processes: one for the Next.js frontend and one for the Genkit AI flows.

    -   **Start the Genkit server (in a separate terminal):**
        ```bash
        npm run genkit:watch
        ```

    -   **Start the Next.js frontend:**
        ```bash
        npm run dev
        ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📁 Project Structure

-   `src/app/`: Contains the core pages and layouts of the Next.js application.
-   `src/ai/`: Home for all Genkit-related code, including AI flows.
-   `src/components/`: Shared React components, organized by feature (e.g., `chat`, `ui`).
-   `src/lib/`: Utility functions, type definitions, and shared logic.
-   `public/`: Static assets like images, fonts, and `robots.txt`.

## ☁️ Deployment

This application is configured for easy deployment with [Firebase App Hosting](https://firebase.google.com/docs/app-hosting). You can deploy it by connecting your repository to a Firebase project.
