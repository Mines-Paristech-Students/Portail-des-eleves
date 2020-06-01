export function isImageMime(mimeType: string): boolean {
    console.log(mimeType)
    return (mimeType || "").startsWith("image");
}
