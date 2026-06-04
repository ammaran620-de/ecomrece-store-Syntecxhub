import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dummy_cloud_name",
  api_key: process.env.CLOUDINARY_API_KEY || "dummy_api_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "dummy_api_secret",
  secure: true,
});

export default cloudinary;

/**
 * Uploads a base64 or file buffer to Cloudinary
 */
export async function uploadImage(fileUri: string, folder = "aura-store"): Promise<string> {
  if (!process.env.CLOUDINARY_API_SECRET) {
    // If not configured, return a mock URL using unsplash or placeholder
    return `https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800`;
  }
  
  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}
