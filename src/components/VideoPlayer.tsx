"use client";

import { useState } from "react";
import { Play, Pause, Download, Share2, RotateCcw, Tv } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  dogName?: string;
}

export default function VideoPlayer({ videoUrl, dogName }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleTogglePlay = () => {
    const video = document.getElementById("pup-video") as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Video container */}
      <div className="relative rounded-2xl overflow-hidden video-glow mb-6">
        <video
          id="pup-video"
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full aspect-video object-cover"
        />

        {/* Overlay controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
          <button
            onClick={handleTogglePlay}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Title badge */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-white font-medium">
            {dogName ? `${dogName}'s Adventure` : "PupTV Adventure"}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button className="gradient-card rounded-xl p-3 flex flex-col items-center gap-2 hover:border-purple-500/40 transition-all">
          <Download className="w-5 h-5 text-purple-400" />
          <span className="text-xs text-slate-400">Download</span>
        </button>
        <button className="gradient-card rounded-xl p-3 flex flex-col items-center gap-2 hover:border-purple-500/40 transition-all">
          <Tv className="w-5 h-5 text-red-400" />
          <span className="text-xs text-slate-400">Upload to YouTube</span>
        </button>
        <button className="gradient-card rounded-xl p-3 flex flex-col items-center gap-2 hover:border-purple-500/40 transition-all">
          <Share2 className="w-5 h-5 text-pink-400" />
          <span className="text-xs text-slate-400">Share</span>
        </button>
        <button className="gradient-card rounded-xl p-3 flex flex-col items-center gap-2 hover:border-purple-500/40 transition-all">
          <RotateCcw className="w-5 h-5 text-amber-400" />
          <span className="text-xs text-slate-400">New Adventure</span>
        </button>
      </div>
    </div>
  );
}
