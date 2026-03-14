export type CloudinaryTransformOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "crop" | "scale" | "thumb";
  filter?: "grayscale" | "sepia" | "blur";
};

function getCloudName(): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. Add it to apps/web/.env.",
    );
  }

  return cloudName;
}

export function getTransformedUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {},
): string {
  const transforms = [
    options.width && `w_${options.width}`,
    options.height && `h_${options.height}`,
    options.crop && `c_${options.crop}`,
    options.filter && `e_${options.filter}`,
    "f_auto",
    "q_auto",
  ]
    .filter(Boolean)
    .join(",");

  const cloudName = getCloudName();
  const encodedPublicId = publicId
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${encodedPublicId}`;
}
