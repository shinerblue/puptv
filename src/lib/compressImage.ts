/**
 * Client-side image compression. Resizes to fit within maxDimension
 * (default 1024px on the long edge) and re-encodes as JPEG.
 *
 * Used by the create flow's photo step so uploads stay small.
 * In demo mode nothing actually receives these bytes over the
 * network, but the compression itself is real and matches what
 * the production pipeline expects (see pipeline/puptv_pipeline_test.py).
 */
export async function compressImageToJpeg(
  file: File,
  maxDimension: number = 1024,
  quality: number = 0.85
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image"));
            return;
          }
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve({ blob, dataUrl, width, height });
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = objectUrl;
  });
}
