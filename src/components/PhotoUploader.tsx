"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X } from "lucide-react";

interface PhotoUploaderProps {
  onPhotosSelected: (files: File[]) => void;
  maxPhotos?: number;
}

export default function PhotoUploader({
  onPhotosSelected,
  maxPhotos = 5,
}: PhotoUploaderProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (newFiles.length === 0) {
        setError("Please upload image files only (JPG, PNG, etc.)");
        return;
      }
      const total = previews.length + newFiles.length;
      if (total > maxPhotos) {
        setError(`Maximum ${maxPhotos} photos allowed`);
        return;
      }
      const newPreviews = newFiles.map((file) => ({ file, url: URL.createObjectURL(file) }));
      const updated = [...previews, ...newPreviews];
      setPreviews(updated);
      onPhotosSelected(updated.map((p) => p.file));
    },
    [previews, maxPhotos, onPhotosSelected]
  );

  const removePhoto = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previews[index].url);
      const updated = previews.filter((_, i) => i !== index);
      setPreviews(updated);
      onPhotosSelected(updated.map((p) => p.file));
    },
    [previews, onPhotosSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  return (
    <div className="space-y-4">
      <div
        className={`upload-zone rounded-2xl p-10 text-center cursor-pointer ${isDragging ? "drag-active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "#F5F5F5" }}
        >
          <Upload className="w-5 h-5" style={{ color: "#6E6E73" }} />
        </div>
        <p className="font-semibold mb-1" style={{ color: "#1D1D1F" }}>
          Drop your dog&apos;s photos here
        </p>
        <p className="text-sm" style={{ color: "#A1A1AA" }}>
          or click to browse · up to {maxPhotos} photos · JPG, PNG
        </p>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 border"
          style={{ background: "#FEF2F2", color: "#EF4444", borderColor: "#FECACA" }}
        >
          <span>⚠</span>
          {error}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {previews.map((preview, i) => (
            <div
              key={i}
              className="relative group aspect-square rounded-xl overflow-hidden border"
              style={{ borderColor: "#E5E5E5" }}
            >
              <img src={preview.url} alt={`Dog photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.6)" }}
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          {previews.length < maxPhotos && (
            <div
              className="aspect-square rounded-xl upload-zone flex flex-col items-center justify-center cursor-pointer gap-1"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-4 h-4" style={{ color: "#A1A1AA" }} />
              <span className="text-xs" style={{ color: "#A1A1AA" }}>Add more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
