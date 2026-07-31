"use client";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YouTubeEmbed({ videoId, title = "PupTV sample episode" }: YouTubeEmbedProps) {
  return (
    <div
      className="aspect-video rounded-2xl overflow-hidden border"
      style={{ borderColor: "#E5E5E5", background: "#000000" }}
    >
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
