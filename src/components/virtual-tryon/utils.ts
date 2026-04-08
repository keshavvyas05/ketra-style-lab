export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to convert file to base64."));
        return;
      }
      resolve(reader.result);
    };

    reader.onerror = () => reject(new Error("File reading failed."));
    reader.readAsDataURL(file);
  });
