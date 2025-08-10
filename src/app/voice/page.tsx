// src/app/voice/page.tsx
"use client";

import { Mic } from 'lucide-react';
import Link from 'next/link';

export default function VoiceTakingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <div className="text-center">
        <Mic className="mx-auto h-24 w-24 text-primary animate-pulse" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Listening...</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start speaking and I&apos;ll transcribe it for you.
        </p>
      </div>
      <div className="absolute bottom-10">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Go back to chat
        </Link>
      </div>
    </div>
  );
}
