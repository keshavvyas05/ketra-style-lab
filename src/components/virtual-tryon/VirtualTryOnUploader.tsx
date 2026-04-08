import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { requestTryOn } from "./api";
import { fileToBase64 } from "./utils";
import { supabase } from "@/integrations/supabase/client";

type SelectedImage = {
  file: File;
  previewUrl: string;
};

type VirtualTryOnUploaderProps = {
  onSuccess?: () => void;
};

const VirtualTryOnUploader = ({ onSuccess }: VirtualTryOnUploaderProps) => {
  const [userImage, setUserImage] = useState<SelectedImage | null>(null);
  const [outfitImage, setOutfitImage] = useState<SelectedImage | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToStorage = async (file: Blob, path: string) => {
    const { error: uploadError } = await supabase.storage.from("tryon-results").upload(path, file, {
      upsert: true,
      contentType: file.type || "image/png",
    });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("tryon-results").getPublicUrl(path);
    return data.publicUrl;
  };

  useEffect(() => {
    return () => {
      if (userImage?.previewUrl) URL.revokeObjectURL(userImage.previewUrl);
      if (outfitImage?.previewUrl) URL.revokeObjectURL(outfitImage.previewUrl);
    };
  }, [userImage, outfitImage]);

  const updateImage =
    (setter: React.Dispatch<React.SetStateAction<SelectedImage | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      console.log("[tryon][frontend] file selected", {
        name: file.name,
        type: file.type,
        size: file.size,
      });
      setError(null);
      setter((prev) => {
        if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
        return { file, previewUrl: URL.createObjectURL(file) };
      });
    };

  const handleSubmit = async () => {
    if (!userImage || !outfitImage) {
      setError("Please upload both images.");
      console.warn("[tryon][frontend] submit blocked: missing files");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("[tryon][frontend] starting conversion to base64");
      const [userBase64, outfitBase64] = await Promise.all([
        fileToBase64(userImage.file),
        fileToBase64(outfitImage.file),
      ]);
      console.log("[tryon][frontend] base64 conversion done", {
        userImageChars: userBase64.length,
        outfitImageChars: outfitBase64.length,
      });
      const output = await requestTryOn({ user_image: userBase64, outfit_image: outfitBase64 });
      setResultImage(output);
      console.log("[tryon][frontend] result image set", { output });

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("No authenticated session found.");
      }

      const timestamp = Date.now();
      const userImagePath = `${userId}/${timestamp}-user-${userImage.file.name}`;
      const outfitImagePath = `${userId}/${timestamp}-outfit-${outfitImage.file.name}`;
      const resultImagePath = `${userId}/${timestamp}-result.png`;

      const resultBlob = await fetch(output).then((r) => r.blob());
      const [userImageUrl, outfitImageUrl, resultImageUrl] = await Promise.all([
        uploadToStorage(userImage.file, userImagePath),
        uploadToStorage(outfitImage.file, outfitImagePath),
        uploadToStorage(resultBlob, resultImagePath),
      ]);

      const { error: insertError } = await (supabase as any).from("tryon_sessions").insert({
        user_id: userId,
        user_image_url: userImageUrl,
        outfit_image_url: outfitImageUrl,
        result_image_url: resultImageUrl,
      });

      if (insertError) throw insertError;
      console.log("[tryon][frontend] try-on session saved to Supabase", {
        userId,
        userImageUrl,
        outfitImageUrl,
        resultImageUrl,
      });

      onSuccess?.();
    } catch (err) {
      console.error("[tryon][frontend] submit failed", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-5 flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3">
        <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          User Image
          <input type="file" accept="image/*" onChange={updateImage(setUserImage)} className="mt-1 block w-full text-xs" />
        </label>
        {userImage && <img src={userImage.previewUrl} alt="User preview" className="w-full h-24 object-cover rounded-lg border border-border/40" />}

        <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Outfit Image
          <input type="file" accept="image/*" onChange={updateImage(setOutfitImage)} className="mt-1 block w-full text-xs" />
        </label>
        {outfitImage && <img src={outfitImage.previewUrl} alt="Outfit preview" className="w-full h-24 object-cover rounded-lg border border-border/40" />}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-xl bg-primary text-primary-foreground py-2 text-xs uppercase tracking-[0.12em] disabled:opacity-60"
      >
        {loading ? "Processing..." : "Generate Try-On"}
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {resultImage ? (
        <img src={resultImage} alt="Try-on result" className="w-full h-28 object-cover rounded-lg border border-border/40" />
      ) : (
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-[11px] uppercase tracking-[0.12em] py-3 border border-dashed border-border/40 rounded-lg">
          <Camera size={14} />
          Result will appear here
        </div>
      )}
    </div>
  );
};

export default VirtualTryOnUploader;
