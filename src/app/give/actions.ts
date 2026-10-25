"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { addBoard } from "@/lib/boards";
import { savePhoto } from "@/lib/photos";

export type GiveState = { error?: string; values?: Record<string, string> };

const funNames = ["Big Blue", "Sunny", "Lucky", "Biscuit", "Captain", "Noodle", "Mango", "Pickles", "Rocket", "Sandy", "Taco", "Waffles"];

function text(form: FormData, key: string, max: number) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function listBoard(_prev: GiveState, form: FormData): Promise<GiveState> {
  const values = {
    name: text(form, "name", 40),
    ready: text(form, "ready", 5),
    town: text(form, "town", 60),
    zip: text(form, "zip", 5),
    length: text(form, "length", 5),
    brand: text(form, "brand", 60),
    blurb: text(form, "blurb", 200),
  };
  const fail = (error: string): GiveState => ({ error, values });

  const photo = form.get("photo");
  if (!(photo instanceof File) || photo.size === 0) return fail("Please add a photo of the board. No photo, no listing.");
  if (values.ready !== "yes" && values.ready !== "no") return fail("Please say if it can go surfing today.");
  if (!values.town) return fail("Please add your town or neighborhood.");
  if (values.zip && !/^\d{5}$/.test(values.zip)) return fail("A zip code is 5 numbers, like 92648.");
  const lengthFt = values.length ? Number(values.length) : null;
  if (lengthFt !== null && !(lengthFt >= 3 && lengthFt <= 12)) return fail("Length should be in feet, between 3 and 12.");

  const saved = await savePhoto(photo);
  if ("error" in saved) return fail(saved.error);

  const name = values.name || funNames[Math.floor(Math.random() * funNames.length)];
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "board";
  const id = `${slug}-${randomBytes(2).toString("hex")}`;

  addBoard(id, {
    name,
    blurb: values.blurb,
    readyToRide: values.ready === "yes",
    lengthFt,
    brand: values.brand || null,
    town: values.town,
    zip: values.zip || null,
    photo: saved.name,
  });
  redirect(`/boards/${id}?new=1`);
}
