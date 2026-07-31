"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { compressImageToJpeg } from "@/lib/compressImage";

export interface CompressedPhoto {
  file: File;
  previewUrl: string;
}

interface PhotoUploaderProps {
  onPhotosSelected: (photos: CompressedPhoto[]) => void;
  maxPhotos?: number;
}

export default function PhotoUploader({
  onPhotosSelected,
  maxPhotos = 5,
}: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<CompressedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (incoming.length === 0) {
        setError("Please choose photo files only (JPG, PNG, HEIC).");
        return;
      }
      if (photos.length + incoming.length > maxPhotos) {
        setError(`You can upload up to ${maxPhotos} photos.`);
        return;
      }

      setIsCompressing(true);
      try {
        const compressed = await Promise.all(
          incoming.map(async (file) => {
            const { blob, dataUrl } = await compressImageToJpeg(file, 1024, 0.85);
            const jpegFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, "") + ".jpg",
              { type: "image/jpeg" }
            );
            return { file: jpegFile, previewUrl: dataUrl };
          })
        );
        const updated = [...photos, ...compressed];
        setPhotos(updated);
        onPhotosSelected(updated);
      } catch {
        setError("Couldn't process one of those photos. Please try a different file.");
      } finally {
        setIsCompressing(false);
      }
    },
    [photos, maxPhotos, onPhotosSelected]
  );

  const removePhoto = useCallback(
    (index: number) => {
      const updated = photos.filter((_, i) => i !== index);
      setPhotos(updated);
      onPhotosSelected(updated);
    },
    [photos, onPhotosSelected]
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
        role="button"
        tabIndex={0}
        aria-label="Upload photos of your dog"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault(); // Space would otherwise scroll the page
            inputRef.current?.click();
          }
        }}
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
          className="icon-well mx-auto mb-4"
        >
          {isCompressing ? (
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#C2410C" }} />
          ) : (
            <Upload className="w-6 h-6" style={{ color: "#C2410C" }} />
          )}
        </div>
        <p className="font-semibold mb-1" style={{ fontSize: "18px", color: "#1D1D1F" }}>
          {isCompressing ? "Preparing your photos…" : "Tap to add photos, or drop them here"}
        </p>
        <p className="text-sm" style={{ color: "#6B625B" }}>
          1 to {maxPhotos} photos of your dog · JPG or PNG
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 border"
          style={{ background: "#FEF2F2", color: "#B91C1C", borderColor: "#F3B9B9" }}
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="relative group aspect-square tile"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.previewUrl} alt={`Your dog, photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                aria-label={`Remove photo ${i + 1}`}
                className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(45,28,12,0.72)" }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
          {photos.length < maxPhotos && (
            <div
              className="aspect-square rounded-xl upload-zone flex flex-col items-center justify-center cursor-pointer gap-1"
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Add another photo"
              onKeyDown={(e) => {
                // This tile was focusable but had no key handler — keyboard
                // users could reach it and never activate it.
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
            >
              <Upload className="w-5 h-5" style={{ color: "#C2410C" }} />
              <span className="text-xs" style={{ color: "#6B625B" }}>Add more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
