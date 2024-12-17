import { env } from "@/lib/env";
import { generateUploadButton } from "@uploadthing/react";

export const UploadButton = generateUploadButton({
  url: env.NEXT_PUBLIC_API_URL + "/api/uploadthing",
});
