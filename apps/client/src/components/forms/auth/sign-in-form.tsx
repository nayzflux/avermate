"use client";

import React from "react";
import { z, ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  password: z.string().min(8).max(2048),
  email: z.string().email().max(320),
});

type SignInSchema = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (values: SignInSchema) => {
      const res = await ky.post("http://localhost:5000/api/auth/sign-in", {
        json: values,
        credentials: "include",
      });
    },
    onSuccess: () => {
      // Redirect to the sign-in page.
      router.push("/app/dashboard");
    }
  });

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      password: "fuckyou",
      email: "idontcare@gmail.com",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: SignInSchema) => {
    console.log(values);
    mutate(values);
  };

  return (
    <div className="md:min-w-[500px] w-[80%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isPending}>
            Sign In
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <a href="/auth/sign-up">
          Don't have an account? Sign up here
        </a>
      </div>
    </div>
  );
};
