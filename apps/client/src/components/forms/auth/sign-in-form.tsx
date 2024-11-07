"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  password: z.string().min(8).max(2048),
  email: z.string().email().max(320),
});

type SignInSchema = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const router = useRouter();
  const toaster = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async ({ email, password }: SignInSchema) => {
      const data = await authClient.signIn.email({
        email,
        password,
      });

      return data;
    },
    onSuccess: (data) => {
      // Redirect to the dashboard
      router.push("/dashboard");

      // Send toast notification
      toaster.toast({
        title: `Welcome back ${data.user.name}!`,
        description: "We hope you reached your goals 🚀!",
      });
    },

    onError: (err) => {
      // TODO: Error handling
      toaster.toast({
        title: "Failed to sign-in",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = (values: SignInSchema) => {
    mutate(values);
  };

  return (
    <div className="md:min-w-[500px] w-[80%]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input
                    type="text"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2 size-4" />}
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
};
