import { env } from "@/lib/env";
import ky from "ky";

export const apiClient = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL + "/api",
  credentials: "include",
});
