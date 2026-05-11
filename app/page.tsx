'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Zap, MessageSquare } from 'lucide-react';
import UploadZone from '../components/UploadZone';
import LoadingSkeleton from '../components/LoadingSkeleton';

const features = [
  { icon: FileText, label: 'Instant Summary', desc: 'Get the full picture in seconds' },
  { icon: Zap, label: 'Key Insights', desc: 'AI extracts what matters most' },
  { icon: MessageSquare, label: 'Chat with Doc', desc: 'Ask anything, get cited answers' },
];

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!file) return;
    setError(null);
    setAnalyzing(true);

    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/analyze', { method: 'POST', body: form });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err?.error || 'Failed to analyze document');
      }

      const payload = await res.json();
      localStorage.setItem('smartread_last_analysis', JSON.stringify(payload));
      router.push('/analyze');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed.';
      setError(message);
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  }

  if (analyzing) return <LoadingSkeleton />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative py-20">
      {/* Background orbs */}
      <div className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-800 via-indigo-700 to-transparent opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full bg-gradient-to-bl from-indigo-700 via-purple-600 to-transparent opacity-10 blur-3xl pointer-events-none" />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-2xl flex flex-col items-center gap-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium"
        >
          <Sparkles size={14} />
          Powered by Claude AI
        </motion.div>

        {/* Headline */}
        <div className="text-center space-y-3">
          <h1 className="font-syne text-5xl sm:text-6xl font-extrabold leading-tight">
            <span className="gradient-text">SmartRead</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg sm:text-xl max-w-md mx-auto leading-relaxed">
            Drop a document. Get instant summaries, key insights, and a live chat — all powered by AI.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm"
            >
              <Icon size={14} className="text-purple-400" />
              <span className="text-[var(--text-primary)] font-medium">{label}</span>
              <span className="text-[var(--text-muted)] hidden sm:inline">— {desc}</span>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <UploadZone file={file} onFileSelect={setFile} />

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 w-full text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Analyze button */}
        {file && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-4 rounded-2xl font-syne font-bold text-lg text-white
              bg-gradient-to-r from-violet-600 to-indigo-600
              hover:from-violet-500 hover:to-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-violet-500/25
              transition-all duration-200 active:scale-[0.98]"
          >
            {analyzing ? 'Analyzing…' : 'Analyze Document →'}
          </motion.button>
        )}

        <p className="text-[var(--text-muted)] text-xs text-center">
          Supports PDF files up to 10MB · Your data is never stored
        </p>
      </motion.section>
    </main>
  );
}
