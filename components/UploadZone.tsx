'use client';
import React, { useRef, useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export default function UploadZone({ file, onFileSelect }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      onFileSelect(dropped);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  }

  function formatSize(bytes: number) {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <AnimatePresence mode="wait">
      {file ? (
        <motion.div
          key="file-selected"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-violet-500/10 border border-violet-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <File size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="text-[var(--text-primary)] text-sm font-medium truncate max-w-[220px]">
                {file.name}
              </p>
              <p className="text-[var(--text-muted)] text-xs">{formatSize(file.size)}</p>
            </div>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            className="text-[var(--text-muted)] hover:text-red-400 transition-colors p-1 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="upload-zone"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-4 transition-all duration-200 ${
            dragging
              ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
              : 'border-[var(--border)] hover:border-violet-500/50 hover:bg-white/[0.02]'
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
            dragging ? 'bg-violet-500/20 pulse-ring' : 'bg-white/[0.04]'
          }`}>
            <UploadCloud size={28} className={dragging ? 'text-violet-400' : 'text-[var(--text-muted)]'} />
          </div>
          <div className="text-center">
            <p className="text-[var(--text-primary)] font-medium mb-1">
              {dragging ? 'Drop your PDF here' : 'Drag & drop your PDF'}
            </p>
            <p className="text-[var(--text-muted)] text-sm">or click to browse — max 10MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="hidden"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
