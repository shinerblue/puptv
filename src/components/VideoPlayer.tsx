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
      if (isPlaying) video.pause();
      else video.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <video
          id="pup-video"
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full aspect-video object-cover"
        />
        <div
          className="absolute inset-0 flex items-end p-4 opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)" }}
        >
          <button
            onClick={handleTogglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" />
            )}
          </button>
        </div>
        <div
          className="absolute top-3 left-3 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium text-white"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />
          {dogName ? `${dogName}'s Adventure` : "PupTV Adventure"}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: <Download className="w-5 h-5" />, label: "Download", color: "#6E6E73" },
          { icon: <Tv className="w-5 h-5" />, label: "YouTube", color: "#EF4444" },
          { icon: <Share2 className="w-5 h-5" />, label: "Share", color: "#6E6E73" },
          { icon: <RotateCcw className="w-5 h-5" />, label: "New", color: "#6E6E73" },
        ].map((action) => (
          <button
            key={action.label}
            className="rounded-2xl p-4 flex flex-col items-center gap-2 border"
            style={{ background: "#FFFFFF", borderColor: "#E5E5E5", color: action.color }}
          >
            {action.icon}
            <span className="text-xs font-medium" style={{ color: "#6E6E73" }}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
