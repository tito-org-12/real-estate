export type PropertyImageUploadResult = {
  url: string;
  publicId: string;
};

export interface PropertyImageDataAccess {
  uploadPropertyImage(file: File): Promise<PropertyImageUploadResult>;
}

class CloudinaryPropertyImageDataAccess implements PropertyImageDataAccess {
  async uploadPropertyImage(file: File): Promise<PropertyImageUploadResult> {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
      throw new Error(
        "Missing NEXT_PUBLIC_SERVER_URL. Add it to apps/web/.env.",
      );
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${serverUrl}/upload/property-image`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      let message = "Image upload failed";

      try {
        const payload = (await response.json()) as { error?: string };
        message = payload.error || message;
      } catch {
        // Keep fallback message if response is not JSON.
      }

      throw new Error(message);
    }

    return (await response.json()) as PropertyImageUploadResult;
  }
}

export function createPropertyImageDataAccess(): PropertyImageDataAccess {
  const provider =
    process.env.NEXT_PUBLIC_PROPERTY_IMAGE_STORAGE_PROVIDER || "cloudinary";

  if (provider === "cloudinary") {
    return new CloudinaryPropertyImageDataAccess();
  }

  throw new Error(
    `Unsupported image storage provider: ${provider}. Set NEXT_PUBLIC_PROPERTY_IMAGE_STORAGE_PROVIDER=cloudinary.`,
  );
}
