// Client-side image downscale/compress, run before every upload to Supabase
// Storage so a phone photo (often 4000px+, several MB) doesn't hit the
// public site at full size. Runs in the browser via <canvas> — no extra
// dependency.

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;

export async function resizeImageFile(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  // SVGs have no raster dimensions to resize and compress losslessly-ish;
  // pass them through untouched.
  if (file.type === 'image/svg+xml') return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
  );
  if (!blob) return file;

  // Only use the resized version if it's actually smaller — a tiny source
  // image re-encoded as JPEG can occasionally end up larger than the
  // original (e.g. a small, already-compressed PNG).
  if (blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], newName, { type: 'image/jpeg' });
}
