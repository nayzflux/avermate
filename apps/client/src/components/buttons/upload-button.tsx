import { env } from "@/lib/env";
import { generateUploadButton } from "@uploadthing/react";

export const UploadButton = generateUploadButton({
  url: env.NEXT_PUBLIC_API_URL + "/api/uploadthing",
  fetch: (input, init) => {
    if (input.toString().startsWith(env.NEXT_PUBLIC_API_URL)) {
      return fetch(input, {
        ...init,
        credentials: "include",
      });
    }
    return fetch(input, init);
  }
});
