import "dotenv/config";
import { createContext } from "@my-better-t-app/api/context";
import { appRouter } from "@my-better-t-app/api/routers/index";
import { auth } from "@my-better-t-app/auth";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import cloudinary from "./lib/cloudinary";

const app = new Hono();
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

function validateImageFile(image: unknown): string | null {
  if (!(image instanceof File)) {
    return "No file provided";
  }

  if (!image.type.startsWith("image/")) {
    return "Only image uploads are allowed";
  }

  if (image.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be 8MB or smaller";
  }

  return null;
}

async function uploadImageToCloudinary(
  image: File,
): Promise<UploadApiResponse> {
  const arrayBuffer = await image.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  return await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "my-better-t-app/listings",
        resource_type: "image",
      },
      (
        error: UploadApiErrorResponse | undefined,
        uploadResult: UploadApiResponse | undefined,
      ) => {
        if (error) {
          reject(new Error(error.message || "Cloudinary upload failed"));
          return;
        }

        if (!uploadResult) {
          reject(new Error("Cloudinary did not return upload details"));
          return;
        }

        resolve(uploadResult);
      },
    );

    stream.end(imageBuffer);
  });
}

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.post("/upload/property-image", async (c) => {
  const session = await auth.api.getSession({
    headers: new Headers(c.req.header()),
  });

  if (!session?.user?.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.parseBody();
  const image = body.image;

  const validationError = validateImageFile(image);
  if (validationError) {
    return c.json({ error: validationError }, 400);
  }

  if (!(image instanceof File)) {
    return c.json({ error: "No file provided" }, 400);
  }

  try {
    const result = await uploadImageToCloudinary(image);

    return c.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return c.json({ error: "Upload failed" }, 500);
  }
});

export const apiHandler: any = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error: any) => {
      console.error(error);
    }),
  ],
});

export const rpcHandler: any = new RPCHandler(appRouter, {
  interceptors: [
    onError((error: any) => {
      console.error(error);
    }),
  ],
});

app.use("/*", async (c, next) => {
  const context = await createContext({ context: c });

  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: context,
  });

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api-reference",
    context: context,
  });

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  await next();
});

app.get("/", (c) => {
  return c.text("OK");
});

import { serve } from "@hono/node-server";
import cron from "node-cron";

// Health check endpoint - used to keep service alive
app.get("/health", (c) => {
  return c.json(
    { status: "ok", timestamp: new Date().toISOString() },
    200
  );
});

// Keep-alive cron job to prevent Render sleep
// Pings the health endpoint every 5 minutes to keep the service warm
const keepAliveJob = cron.schedule("*/5 * * * *", async () => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[Keep-Alive] Service ping at ${timestamp}`);

    // Ping the health endpoint locally to keep the process responsive
    await fetch("http://localhost:3000/health");
  } catch (error) {
    console.error("[Keep-Alive] Error:", error instanceof Error ? error.message : error);
  }
});

// Graceful shutdown
process.on("SIGINT", () => {
  keepAliveJob.stop();
  console.log("Keep-alive cron job stopped");
  process.exit(0);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`Keep-alive job started - runs every minute`);
  },
);

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
