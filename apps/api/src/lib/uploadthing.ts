import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { eq } from "drizzle-orm";
import {
  createRouteHandler,
  createUploadthing,
  UploadThingError,
  UTApi,
  type FileRouter,
} from "uploadthing/server";

export const ut = new UTApi();

const f = createUploadthing();

export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async (c) => {
      console.log(c)
      const session = await auth.api.getSession({
        r
      });

      console.log(session);

      if (!session) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id, avatarUrl: session.user.image };
    })
    .onUploadComplete(async (data) => {
      console.log(
        `Avatar uploaded ${data.file.key} by ${data.metadata.userId}`
      );

      const avatarUrl = data.metadata.avatarUrl;

      // Delete previous avatar
      try {
        if (avatarUrl) {
          if (avatarUrl.startsWith("https://utfs.io")) {
            const avatarKey = avatarUrl.split("/").pop();

            if (avatarKey) {
              await ut.deleteFiles(avatarKey);
            }
          }
        }
      } catch (err) {
        console.error("Failed to delete previous avatar");
        console.error(err);
      }

      // Update avata url
      await db
        .update(users)
        .set({ avatarUrl: data.file.url })
        .where(eq(users.id, data.metadata.userId));

      console.log(`Avatar updated ${data.file.key} by ${data.metadata.userId}`);

      return {
        message: "Avatar uploaded",
        url: data.file.url,
      };
    }),
} satisfies FileRouter;

export const uploadHandlers = createRouteHandler({
  router: uploadRouter,
  config: {
    callbackUrl: env.BETTER_AUTH_URL + "/api/uploadthing",
  },
});

export type OurFileRouter = typeof uploadRouter;
