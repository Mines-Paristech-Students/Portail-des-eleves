export const isImageMime = (mimeType: string): boolean =>
    (mimeType || "").startsWith("image");
