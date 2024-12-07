import { env } from "@/lib/env";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    throw: true,
    onError(context) {
      context.error
    },
  },
});
