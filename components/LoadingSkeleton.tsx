'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const steps = [
  'Extracting text from PDF…',
  'Reading the document…',
  'Identifying key insights…',
  'Building your summary…',
];

export default function LoadingSkeleton() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 py-20">
      {/* Animated brain icon */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-3xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center"
      >
        <Brain size={36} className="text-violet-400" />
      </motion.div>

      <div className="text-center space-y-2">
        <h2 className="font-syne text-2xl font-bold">Analyzing your document</h2>
        <p className="text-[var(--text-muted)] text-sm">Claude is reading every page…</p>
      </div>

      {/* Step indicators */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.5, duration: 0.4 }}
            className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ delay: i * 0.5, duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0"
            />
            {step}
          </motion.div>
        ))}
      </div>

      {/* Skeleton preview */}
      <div className="w-full max-w-md space-y-3 opacity-40">
        {[90, 70, 80, 55, 75].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-full shimmer"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </main>
  );
}
