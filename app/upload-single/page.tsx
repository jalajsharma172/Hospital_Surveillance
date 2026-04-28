'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import VideoPreAnalyzer from '@/components/video-pre-analyzer';
import Link from 'next/link';

interface VideoAnalysisData {
  duration: number;
  resolution: { width: number; height: number };
  frameCount: number;
  fileSize: string;
  codec: string;
  fps: number;
  format: string;
  thumbnail?: string;
}

export default function UploadOneVideoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysisData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProceedWithAnalysis = async () => {
    if (!file || !analysis) return;

    setUploading(true);
    setAnalyzing(true);

    try {
      // Upload the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(analysis));

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();

      // Trigger analysis
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: uploadData.id,
          file: file.name,
          metadata: analysis,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error('Analysis failed');
      }

      // Redirect to video page
      window.location.href = `/pages/video/${uploadData.id}`;
    } catch (error) {
      console.error('Error:', error);
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-gradient"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              ✦
            </div>
            <span className="font-bold text-xl">Nazar AI</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/pages/saved-videos" className="text-white/70 hover:text-white transition-colors">
              Library
            </Link>
            <Link href="/pages/statistics" className="text-white/70 hover:text-white transition-colors">
              Statistics
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block mb-6"
          >
            <div className="inline-block px-4 py-2 glass rounded-full border border-white/20">
              <span className="text-neon-blue font-semibold">🚀 Premium Analysis</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Upload & Analyze
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-6 gradient-text"
          >
            Your Security Video
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Upload a single video and let our AI detect threats in real-time. Get instant insights with our advanced detection system.
          </motion.p>
        </motion.div>

        {/* Upload Area with Steps */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          {!uploading ? (
            <>
              <VideoPreAnalyzer
                onAnalysisComplete={(result) => {
                  setAnalysis(result);
                }}
                onFileSelect={(selectedFile) => {
                  setFile(selectedFile);
                }}
              />

              {/* Action Button */}
              {analysis && file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex gap-4 justify-center"
                >
                  <button
                    onClick={handleProceedWithAnalysis}
                    className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start AI Analysis
                  </button>

                  <Link
                    href="/"
                    className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </Link>
                </motion.div>
              )}
            </>
          ) : (
            // Full-Screen System Analysis Animation
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] bg-black overflow-hidden font-mono"
            >
              {/* Massive Layout Pixel Grid */}
              <div className="absolute inset-0 grid grid-cols-12 md:grid-cols-20 lg:grid-cols-24 gap-1 opacity-50 p-2">
                {Array.from({ length: 480 }).map((_, i) => {
                  const isRare = (i % 17 === 0);
                  const isUltraRare = (i % 43 === 0);
                  return (
                    <motion.div
                      key={i}
                      animate={{ 
                        opacity: [0.1, isRare ? 1 : Math.random() * 0.5, 0.1],
                        backgroundColor: isUltraRare ? '#ff0055' : isRare ? '#00ffcc' : '#1a1a1a',
                        scale: [1, isUltraRare ? 1.2 : 1, 1]
                      }}
                      transition={{ 
                        duration: Math.random() * 0.8 + 0.2, 
                        repeat: Infinity, 
                        delay: Math.random() * 2,
                        ease: "steps(3)" // Makes it snap like actual pixels
                      }}
                      className="w-full h-full rounded-[1px]"
                    />
                  )
                })}
              </div>

              {/* Dynamic Overlay HUD */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-black pointer-events-none" />
              <motion.div 
                className="absolute left-0 right-0 h-2 bg-neon-green shadow-[0_0_40px_rgba(0,255,157,1)] z-20"
                animate={{ top: ['-10%', '110%', '-10%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              {/* Central Information Box */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                <div className="bg-black/80 border border-neon-blue/40 backdrop-blur-sm p-10 rounded-xl shadow-[0_0_100px_rgba(0,255,204,0.15)] text-center max-w-lg w-full">
                  
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="w-24 h-24 mx-auto mb-8 border-4 border-dashed border-neon-green rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,157,0.4)]"
                  >
                    <div className="w-12 h-12 bg-neon-blue rounded-full animate-pulse" />
                  </motion.div>

                  <h3 className="text-4xl font-black mb-4 uppercase tracking-[0.2em] text-white">
                    {analyzing ? 'Neural Matrix' : 'Uplink Est.'}
                  </h3>
                  <p className="text-neon-blue text-lg mb-8 font-bold tracking-widest animate-pulse">
                    {analyzing ? 'DECONSTRUCTING VIDEO FRAMES...' : 'TRANSMITTING ENCRYPTED PACKETS...'}
                  </p>

                  <div className="space-y-6 text-left">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-white/50 mb-2 font-bold tracking-widest">
                        <span>SYSTEM LOAD</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-neon-blue to-neon-green"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Step Processing Log */}
                    <div className="bg-black p-4 rounded border border-white/5 h-40 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
                      <div className="text-[10px] space-y-2 text-white/40">
                        <p className="text-neon-green">{"> "} Initializing visual cortical extraction...</p>
                        <p>{"> "} Bounding boxes mapped: {Math.floor(Math.random() * 1000)} objects</p>
                        <p className="text-neon-blue">{"> "} Applying spatial geometry algorithms...</p>
                        <p>{"> "} Cross-referencing threat vectors...</p>
                        <p className="text-white">{"> "} Generating frame-by-frame anomalies...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 pt-12 border-t border-white/10"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Detection Capabilities</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🚨', title: 'Theft Detection', desc: 'Identify suspicious activity' },
              { icon: '🔥', title: 'Fire Detection', desc: 'Detect smoke and flames' },
              { icon: '⚠️', title: 'Fall Detection', desc: 'Alert on person falls' },
              { icon: '👊', title: 'Fight Detection', desc: 'Detect altercations' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
                className="glass rounded-xl p-4 hover:bg-white/10 transition-all group"
              >
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{feature.icon}</div>
                <h3 className="font-bold text-sm">{feature.title}</h3>
                <p className="text-white/50 text-xs mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}