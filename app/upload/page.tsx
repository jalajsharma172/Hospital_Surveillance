"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Upload, Save, Loader2, Brain, Activity, Clock, Shield, Play, Video, X } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { AnalysisOverlay } from "@/components/premium/AnalysisOverlay"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import VideoPlayer from "@/components/video-player"
import TimestampList from "@/components/timestamp-list"
import type { Timestamp } from "@/app/types"
import { detectEvents, type VideoEvent } from "./actions"
import Link from "next/link"
import { saveVideoToSupabase } from "@/lib/supabaseStorage"

export default function UploadPage() {
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [demoVideos, setDemoVideos] = useState<any[]>([])
  const [isLoadingDemos, setIsLoadingDemos] = useState(false)
  const [timestamps, setTimestamps] = useState<Timestamp[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saveProgress, setSaveProgress] = useState(0)
  const [videoName, setVideoName] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoFileRef = useRef<File | null>(null)

  const captureFrame = async (video: HTMLVideoElement, time: number): Promise<string | null> => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    try {
      video.currentTime = time;
      await new Promise((resolve) => { video.onseeked = resolve; });
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      return null;
    }
  };

  const handleFileUpload = async (e: { target: { files: FileList | null } }, demoTimestamps?: Timestamp[]) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setTimestamps([])
    setIsSaved(false)

    try {
      videoFileRef.current = file
      const localUrl = URL.createObjectURL(file)
      setVideoUrl(localUrl)
      setVideoName(file.name.replace(/\.[^/.]+$/, ""))

      while (!videoRef.current) await new Promise(r => setTimeout(r, 100))
      const video = videoRef.current
      video.src = localUrl

      await new Promise((resolve) => {
        video.onloadeddata = resolve;
        if (video.readyState >= 2) resolve(true);
      });

      setIsUploading(false)
      setIsAnalyzing(true)

      const duration = video.duration
      const interval = 2
      const newTimestamps: Timestamp[] = []

      for (let time = 0; time < duration; time += interval) {
        setUploadProgress(Math.floor((time / duration) * 100))
        const frame = await captureFrame(video, time)
        if (frame) {
          try {
            const delayMs = demoTimestamps ? 4500 : 2000;
            if (time > 0) await new Promise(r => setTimeout(r, delayMs));
            
            if (demoTimestamps) {
              // DEMO MODE: Fake analysis using pre-computed JSON
              const minutes = Math.floor(time / 60)
              const seconds = Math.floor(time % 60)
              const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
              
              const matchingEvents = demoTimestamps.filter(t => t.timestamp === timeStr)
              if (matchingEvents.length > 0) {
                newTimestamps.push(...matchingEvents)
                setTimestamps([...newTimestamps]) // Update UI instantly
              }
            } else {
              // REAL MODE: Call Gemini API
              const result = await detectEvents(frame)
              if (result.events) {
                result.events.forEach((event: VideoEvent) => {
                  const minutes = Math.floor(time / 60)
                  const seconds = Math.floor(time % 60)
                  newTimestamps.push({
                    timestamp: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
                    description: event.description,
                    isDangerous: event.isDangerous
                  })
                })
                setTimestamps([...newTimestamps]) // Update UI instantly
              }
            }
          } catch (err) { }
        }
      }

      setTimestamps(newTimestamps)
      setIsAnalyzing(false)
      setUploadProgress(100)
    } catch (error) {
      setIsUploading(false)
      setIsAnalyzing(false)
    }
  }

  const handleSaveVideo = async () => {
    if (!videoUrl || !videoName || !videoFileRef.current) return
    setIsSaving(true)
    setSaveProgress(0)
    try {
      const id = Date.now().toString()
      await saveVideoToSupabase(videoFileRef.current, {
        id, name: videoName, timestamps, uploadedAt: new Date().toISOString(),
      }, (pct) => setSaveProgress(pct))
      setIsSaved(true)
    } catch (err) {
      alert('Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDemoToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setDemoMode(isChecked)
    if (isChecked) {
      setShowDemoModal(true)
      setIsLoadingDemos(true)
      const supabase = createClient()
      const { data, error } = await supabase.storage.from("videos").list("anon")
      console.log("Supabase list result:", { data, error })

      if (error) {
        alert("Failed to fetch from Supabase: " + error.message)
      }

      if (data) {
        const filtered = data.filter(f => f.name.endsWith('.mp4') || f.name.endsWith('.webm') || f.name.endsWith('.ogg') || f.name.endsWith('.mkv') || f.name.endsWith('.avi'))
        console.log("Filtered videos:", filtered)
        setDemoVideos(filtered)
      }
      setIsLoadingDemos(false)
    } else {
      setShowDemoModal(false)
    }
  }

  const handleSelectDemoVideo = async (fileName: string) => {
    setShowDemoModal(false)
    setIsUploading(true)
    setUploadProgress(0)

    const supabase = createClient()
    
    // 1. Fetch JSON metadata for faking analysis
    let demoTimestamps: Timestamp[] | undefined = undefined
    const jsonFileName = fileName.replace(/\.[^/.]+$/, ".json")
    const { data: jsonData } = await supabase.storage.from("videos").download(`anon/${jsonFileName}`)
    if (jsonData) {
      try {
        const text = await jsonData.text()
        const meta = JSON.parse(text)
        if (meta.timestamps) {
          demoTimestamps = meta.timestamps
        }
      } catch (e) {
        console.error("Failed to parse demo json", e)
      }
    }

    // 2. Fetch the video itself
    const { data, error } = await supabase.storage.from("videos").download(`anon/${fileName}`)
    if (data) {
      const file = new File([data], fileName, { type: data.type || "video/mp4" })
      handleFileUpload({ target: { files: [file] as unknown as FileList } }, demoTimestamps)
    } else {
      setIsUploading(false)
      alert("Failed to download demo video")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <style dangerouslySetInnerHTML={{
        __html: `
        #checkboxInput { display: none; }
        .toggleSwitch { display: flex; align-items: center; justify-content: center; position: relative; width: 60px; height: 30px; background-color: rgb(199, 199, 199); border-radius: 20px; cursor: pointer; transition-duration: .3s; }
        .toggleSwitch::after { content: ""; position: absolute; height: 30px; width: 30px; left: 0px; background: conic-gradient(rgb(104, 104, 104),white,rgb(104, 104, 104),white,rgb(104, 104, 104)); border-radius: 50%; transition-duration: .3s; box-shadow: 5px 2px 7px rgba(8, 8, 8, 0.308); }
        #checkboxInput:checked+.toggleSwitch::after { transform: translateX(100%); transition-duration: .3s; }
        #checkboxInput:checked+.toggleSwitch { background-color: rgb(153, 197, 151); transition-duration: .3s; }
      `}} />

      <div className="absolute top-6 right-6 sm:right-10 z-50 flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-2xl">
        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/60">Demo Mode</span>
        <div className="relative">
          <input id="checkboxInput" type="checkbox" checked={demoMode} onChange={handleDemoToggle} />
          <label className="toggleSwitch" htmlFor="checkboxInput"></label>
        </div>
      </div>

      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => { setShowDemoModal(false); setDemoMode(false); }} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Play className="w-5 h-5 text-blue-400" /> Select Demo Video</h2>

              {isLoadingDemos ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                  <span className="text-white/50 text-sm font-medium">Fetching from Matrix...</span>
                </div>
              ) : demoVideos.length === 0 ? (
                <div className="py-8 text-center text-white/50">
                  No demo videos found in "videos/anon" storage folder.
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {demoVideos.map(vid => (
                    <button
                      key={vid.name}
                      onClick={() => handleSelectDemoVideo(vid.name)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:scale-[1.02] active:scale-[0.98] text-left group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Video className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold truncate text-white/90 group-hover:text-white transition-colors">{vid.name}</div>
                        <div className="text-xs text-white/40 mt-0.5">{(vid.metadata?.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 mesh-gradient opacity-20" />

      <main className="relative z-10 flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-blue-400 font-bold text-xs uppercase tracking-widest"
            >
              <Activity className="w-3 h-3 animate-pulse" /> Neural Processing Core
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
              <span className="gradient-text">INTELLIGENT</span> <br /> UPLOAD
            </h1>
            <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto">
              Feed your surveillance stream into our neural matrix for instant event reconstruction.
            </p>
          </div>

          {!videoUrl ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group h-[450px] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="absolute inset-0 glass group-hover:bg-white/10 transition-all duration-700" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white/5 group-hover:border-blue-500/50 transition-all rounded-2xl">
                <div className="w-24 h-24 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-400/30 mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Upload className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Engage Signal Feed</h2>
                <p className="text-white/40 font-medium">MP4, WebM, or OGG up to 500MB</p>
                <input id="file-input" type="file" className="hidden" accept="video/*" onChange={handleFileUpload} />
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                {/* Progress Status */}
                {(isUploading || isAnalyzing) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-8 space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                          <Brain className="w-4 h-4 animate-pulse" /> {isUploading ? 'Materializing Signal' : 'Neural Reconstructing'}
                        </div>
                        <h3 className="text-2xl font-bold">{isUploading ? 'Uploading...' : 'Analyzing Frames...'}</h3>
                      </div>
                      <div className="text-4xl font-black text-white/20">{uploadProgress}%</div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Video Container */}
                <div className="glass rounded-2xl p-4 border-white/5 overflow-hidden shadow-2xl relative">
                  <div className="aspect-video rounded-xl bg-zinc-950 overflow-hidden relative border border-white/5">
                    <VideoPlayer url={videoUrl} timestamps={timestamps} ref={videoRef} />

                    {/* Pixelation Analysis Overlay */}
                    <AnimatePresence>
                      {isAnalyzing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
                        >
                          <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-40">
                            {[...Array(96)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  opacity: [0, 0.5, 0],
                                  backgroundColor: i % 3 === 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0,0,0,0.6)'
                                }}
                                transition={{
                                  duration: Math.random() * 1.5 + 0.5,
                                  repeat: Infinity,
                                  delay: Math.random() * 2
                                }}
                                className="border-[0.5px] border-white/5"
                              />
                            ))}
                          </div>
                          <div className="absolute inset-0 noise-bg opacity-[0.08] animate-glitch-pixel" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div className="glass rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-4">Registry Name</label>
                    <Input
                      value={videoName}
                      onChange={(e) => setVideoName(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 text-lg font-bold focus:ring-2 ring-blue-500/20"
                    />
                  </div>
                  <Button
                    onClick={handleSaveVideo}
                    disabled={isSaving || isSaved}
                    className={`h-14 px-10 rounded-[1.5rem] font-black tracking-tight text-lg transition-all ${isSaved ? 'bg-green-600' : 'btn-primary'}`}
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : isSaved ? <><CheckCircle2 className="mr-2" /> Secured</> : <><Save className="mr-2" /> Save to Matrix</>}
                  </Button>
                </div>
              </div>

              {/* Feed Column */}
              <div className="lg:col-span-4 h-fit">
                <div className="glass rounded-2xl p-8 border-white/5 h-full max-h-[800px] flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black flex items-center gap-2">
                      <Shield className="w-6 h-6 text-blue-400" /> Event Feed
                    </h3>
                    {isAnalyzing && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {timestamps.length === 0 && !isAnalyzing ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center opacity-20">
                        <Clock className="w-12 h-12 mb-4" />
                        <p className="font-bold">No anomalies detected yet.</p>
                      </div>
                    ) : (
                      <TimestampList
                        timestamps={timestamps}
                        onTimestampClick={(t) => {
                          const [m, s] = t.split(':').map(Number)
                          if (videoRef.current) {
                            videoRef.current.currentTime = m * 60 + s
                            videoRef.current.play()
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-12 border-t border-white/5 text-center opacity-20 font-mono text-xs uppercase tracking-[0.3em]">
        Signal Processing Node v4.0 // Secured Protocol
      </footer>
    </div>
  )
}

