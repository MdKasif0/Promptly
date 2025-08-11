
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  metadataBase: new URL('https://promptly-ai-chatbot.netlify.app/'),
  title: {
    default: 'Promptly: Your Advanced AI Chat Copilot',
    template: `%s | Promptly`,
  },
  description: 'An AI chat app for instant intelligent conversations',
  keywords: ['AI Chat', 'Chatbot', 'AI Assistant', 'Promptly', 'Genkit', 'Next.js', 'OpenRouter', 'Gemini API', 'PWA'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Promptly: Your Advanced AI Chat Copilot',
    description: 'An AI chat app for instant intelligent conversations',
    url: 'https://promptly-ai-chatbot.netlify.app/',
    siteName: 'Promptly',
    images: [
      {
        url: '/promptly-cover.png',
        width: 1200,
        height: 630,
        alt: 'Promptly AI Chat Copilot Cover Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promptly: Your Advanced AI Chat Copilot',
    description: 'An AI chat app for instant intelligent conversations',
    images: ['/promptly-cover.png'],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Promptly',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0d6efd" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/promptly-192x192.png"></link>
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
