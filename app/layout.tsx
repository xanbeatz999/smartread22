import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import ParticleBackground from '../components/ParticleBackground';

export const metadata: Metadata = {
  title: 'SmartRead — AI-powered PDF Document Analyst',
  description: 'Drop a document. Understand everything.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#030308" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] antialiased min-h-screen">
        <ParticleBackground />
        <div className="relative z-10 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
