import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  metadataBase: new URL('https://promptly.com'),
  title: {
    default: 'Promptly: Your Advanced AI Chat Copilot',
    template: `%s | Promptly`,
  },
  description: 'Experience Promptly, the advanced AI chat copilot. Engage in intelligent conversations, generate creative text, and get instant answers with a powerful multi-model AI.',
  keywords: ['AI Chat', 'Chatbot', 'AI Assistant', 'Promptly', 'Genkit', 'Next.js', 'OpenRouter', 'Gemini API'],
  openGraph: {
    title: 'Promptly: Your Advanced AI Chat Copilot',
    description: 'Experience Promptly, the advanced AI chat copilot. Engage in intelligent conversations, generate creative text, and get instant answers with a powerful multi-model AI.',
    url: 'https://promptly.com',
    siteName: 'Promptly',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Promptly AI Chat Copilot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promptly: Your Advanced AI Chat Copilot',
    description: 'Experience Promptly, the advanced AI chat copilot. Engage in intelligent conversations, generate creative text, and get instant answers with a powerful multi-model AI.',
    images: ['https://placehold.co/1200x630.png'],
    creator: '@promptly',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
