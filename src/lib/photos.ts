import "server-only";
import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { photoDir } from "./db";

// Photo types we accept, and the file ending we save each one with.
export const photoTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
};

export const maxPhotoMb = 10;

// Saves an uploaded photo and returns its new file name, or an error message.
export async function savePhoto(file: File): Promise<{ name: string } | { error: string }> {
  const ext = photoTypes[file.type];
  if (!ext) return { error: "That photo type won't work. Try a JPG or PNG." };
  if (file.size > maxPhotoMb * 1024 * 1024) return { error: `That photo is too big. Keep it under ${maxPhotoMb} MB.` };
  const name = `${randomBytes(8).toString("hex")}.${ext}`;
  await writeFile(path.join(/*turbopackIgnore: true*/ photoDir, name), Buffer.from(await file.arrayBuffer()));
  return { name };
}
