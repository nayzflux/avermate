"use client";

import { ResetPasswordButton } from "@/components/buttons/auth/reset-password-button";
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
import { env } from "@/lib/env";
import { BetterFetchError } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  password: z.string().min(8).max(2048),
  email: z.string().email().max(320),
});

type SignInSchema = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const router = useRouter();
  const toaster = useToast();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async ({ email, password }: SignInSchema) => {
      const data = await authClient.signIn.email({
        email,
        password,
        callbackURL: `${env.NEXT_PUBLIC_CLIENT_URL}/dashboard`,
      });

      return data;
    },
    onSuccess: async (data) => {
      // If email is not verified
      if (!data.user.emailVerified) {
        // Send a verification link
        await authClient.sendVerificationEmail({
          email: data.user.email,
        });

        toaster.toast({
          title: "✉️ Email non vérifié",
          description: `Un lien de vérification a été envoyé à l'adresse ${data.user.email}.`,
        });

        router.push("/auth/verify-email");

        return;
      }

      // Redirect to the dashboard
      router.push("/dashboard");

      // Send toast notification
      toaster.toast({
        title: `👋 Ravi de vous revoir ${data.user.name} !`,
        description: "Nous espérons que vous avez atteint vos objectifs !",
      });
    },

    onError: (err) => {
      if (err instanceof BetterFetchError) {
        const status = err.status;

        if (status === 401) {
          toaster.toast({
            title: "❌ Erreur",
            description: "Email ou mot de passe incorrect",
            variant: "destructive",
          });
          return;
        }
      }

      // Generic error
      toaster.toast({
        title: "❌ Erreur",
        description: "Une erreur est survenue. Réessayez plus tard.",
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
                  <div>
                    {/* Password input field with toggle visibility button */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          className="pe-9"
                          placeholder="********"
                          type={isVisible ? "text" : "password"}
                          {...field}
                        />

                        <button
                          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={toggleVisibility}
                          aria-label={
                            isVisible ? "Hide password" : "Show password"
                          }
                          aria-pressed={isVisible}
                          aria-controls="password"
                        >
                          {isVisible ? (
                            <EyeOff
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye size={16} strokeWidth={2} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending && (
                <Loader2Icon className="animate-spin mr-2 size-4" />
              )}
              Sign In
            </Button>

            <div className="flex justify-end">
              <ResetPasswordButton />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
