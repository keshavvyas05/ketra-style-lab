import type { TryOnErrorResponse, TryOnRequest, TryOnResponse } from "./types";

export async function requestTryOn(payload: TryOnRequest): Promise<string> {
  const BASE_URL = "";

  const res = await fetch(`${BASE_URL}/api/tryon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Try-on request failed (status ${res.status})`);
  }

  const data = (await res.json()) as TryOnResponse;

  if (data.success === false) {
    const err = data as TryOnErrorResponse;
    console.error(err.error);
    throw new Error(err.error);
  } else {
    console.log(data.data);
  }

  const outputImage: unknown = (data as any)?.data?.output_image;
  return typeof outputImage === "string"
    ? outputImage
    : "https://dummyimage.com/600x800/000/fff&text=TryOn+Result";
}
