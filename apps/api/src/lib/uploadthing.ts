import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

export const uploadHandlers = createRouteHandler({
  router: uploadRouter,
});

export type OurFileRouter = typeof uploadRouter;
