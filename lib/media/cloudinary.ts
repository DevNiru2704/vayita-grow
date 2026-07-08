import "server-only";
import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary image hosting. Product images are stored on Cloudinary's CDN and
 * only the secure URL is persisted (per the DB design). Secrets are server-only.
 */

let configured = false;

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function configure(): void {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

/** Uploads image bytes and returns the Cloudinary secure URL. */
export function uploadImage(bytes: Buffer, folder = "vayita/products"): Promise<string> {
  configure();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve(result.secure_url);
      },
    );
    stream.end(bytes);
  });
}
