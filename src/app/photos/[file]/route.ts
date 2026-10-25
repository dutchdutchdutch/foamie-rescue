import { readFile } from "node:fs/promises";
import path from "node:path";
import { photoDir } from "@/lib/db";
import { photoTypes } from "@/lib/photos";

// Serves board photos from data/photos.
export async function GET(_req: Request, ctx: RouteContext<"/photos/[file]">) {
  const { file } = await ctx.params;
  const ext = path.extname(file).slice(1);
  const type = Object.entries(photoTypes).find(([, e]) => e === ext)?.[0];
  if (!/^[a-z0-9-]+\.[a-z]+$/.test(file) || !type) return new Response("Not found", { status: 404 });
  try {
    const bytes = await readFile(path.join(/*turbopackIgnore: true*/ photoDir, file));
    return new Response(bytes, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
