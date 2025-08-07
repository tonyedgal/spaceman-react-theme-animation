'use client';

import { BlurThemeToggle } from '@/components/theme/BlurThemeToggle';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent w-full flex items-center justify-center relative">
      <div className="flex items-center justify-center gap-6 p-6 rounded-lg border border-border bg-background w-1/2">
        <div className="flex gap-2 items-center justify-center">
          <label className="text-md font-medium">Circle Theme:</label>
          <ThemeToggle />
        </div>
        <div className="flex gap-2 items-center justify-center">
          <label className="text-md font-medium">Blur Circle Theme:</label>
          <BlurThemeToggle />
        </div>
      </div>
    </main>
  );
}
