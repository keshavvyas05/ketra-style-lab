import type { TryOnRequest, TryOnResponse } from "./types";

export async function requestTryOn(payload: TryOnRequest): Promise<string> {
  console.log("[tryon][frontend] sending request", {
    userImageChars: payload.user_image.length,
    outfitImageChars: payload.outfit_image.length,
  });

  const res = await fetch("/api/tryon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log("RAW RESPONSE:", text);

  if (!res.ok) {
    throw new Error(`Try-on request failed (status ${res.status})`);
  }

  let data: TryOnResponse;
  try {
    data = JSON.parse(text) as TryOnResponse;
  } catch (e) {
    console.error("JSON PARSE ERROR:", e);
    throw new Error("Invalid JSON response");
  }

  console.log("PARSED DATA:", data);

  if (!data.success) {
    const message = !data.success && data.error ? data.error : `Try-on request failed (status ${res.status}).`;
    console.error("[tryon][frontend] request failed", {
      status: res.status,
      message,
      data,
    });
    throw new Error(message);
  }

  console.log("[tryon][frontend] request success", { outputImage: data.output_image });
  return data.output_image;
}
