declare module "cloudinary" {
  export type UploadApiResponse = {
    secure_url: string;
    public_id: string;
  };

  export type UploadApiErrorResponse = {
    message?: string;
    http_code?: number;
  };

  export const v2: {
    config: (options: {
      cloud_name?: string;
      api_key?: string;
      api_secret?: string;
    }) => void;
    uploader: {
      upload_stream: (
        options: {
          folder?: string;
          resource_type?: "image" | "video" | "raw" | "auto";
        },
        callback: (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => void,
      ) => {
        end: (buffer: Buffer) => void;
      };
    };
  };
}
