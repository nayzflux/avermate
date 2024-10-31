import { env } from "@/lib/env";
import ky from "ky";

const apiClient = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

export async function signUp({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const res = await apiClient.post("auth/sign-up", {
    json: {
      firstName,
      lastName,
      email,
      password,
    },
  });

  const body = await res.json();

  return body;
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await apiClient.post("auth/sign-in", {
    json: {
      email,
      password,
    },
  });

  const body = await res.json();

  return body;
}
