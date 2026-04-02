"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";

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
      const newFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );

      if (newFiles.length === 0) {
        setError("Please upload image files only (JPG, PNG, etc.)");
        return;
      }

      const total = previews.length + newFiles.length;
      if (total > maxPhotos) {
        setError(`Maximum ${maxPhotos} photos allowed`);
        return;
      }

      const newPreviews = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

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
      {/* Drop zone */}
      <div
        className={`upload-zone rounded-2xl p-8 text-center cursor-pointer ${
          isDragging ? "drag-active" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
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
        <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-white mb-2">
          Drop your dog&apos;s photos here
        </p>
        <p className="text-sm text-slate-400">
          or click to browse — up to {maxPhotos} photos (JPG, PNG)
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {previews.map((preview, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden gradient-card">
              <img
                src={preview.url}
                alt={`Dog photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(i);
                }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <ImageIcon className="w-3 h-3" />
                  Photo {i + 1}
                </div>
              </div>
            </div>
          ))}

          {/* Add more slot */}
          {previews.length < maxPhotos && (
            <div
              className="aspect-square rounded-xl upload-zone flex flex-col items-center justify-center cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-6 h-6 text-purple-400 mb-1" />
              <span className="text-xs text-slate-400">Add more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
