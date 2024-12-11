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
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { getPasswordStrength } from "@/utils/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z.object({
  firstName: z.string().min(2).max(32),
  lastName: z.string().min(2).max(32),
  password: z
    .string()
    .min(8)
    .max(128)
    .superRefine((password, ctx) => {
      const strength = getPasswordStrength(password);

      if (strength.strength === "weak") {
        return ctx.addIssue({
          code: "custom",
          message: "Le mot de passe est trop faible.",
        });
      }
    }),
  email: z.string().email().max(320),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const router = useRouter();
  const toaster = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async ({
      firstName,
      lastName,
      email,
      password,
    }: SignUpSchema) => {
      const name = [firstName, lastName].join(" ");

      const data = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: `${env.NEXT_PUBLIC_CLIENT_URL}/onboarding`,
      });

      return data;
    },
    onSuccess: (data) => {
      if (!data.user.emailVerified) {
        toaster.toast({
          title: "✉️ Email non vérifié",
          description: `Un lien de vérification a été envoyé à l'adresse ${data.user.email}.`,
        });

        // Redirect to email verify
        router.push("/auth/verify-email");
        return;
      }
    },

    onError: (err) => {
      // TODO: Gestion des erreurs
      toaster.toast({
        title: "Échec de la création de compte",
        description: "Une erreur s'est produite. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    },
  });

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      email: "",
    },
  });

  const handleSubmit = (values: SignUpSchema) => {
    mutate(values);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-4">
            <div className="w-full">
              <FormField
                control={form.control}
                name="firstName"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Louis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full">
              <FormField
                control={form.control}
                name="lastName"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Durand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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
                    placeholder="email@exemple.com"
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
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <div>
                    {/* Champ de saisie du mot de passe avec bouton d'affichage/masquage */}
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
                            isVisible
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
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

                    {/* Indicateur de force du mot de passe */}
                    <div
                      className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
                      role="progressbar"
                      aria-valuenow={
                        getPasswordStrength(form.getValues("password")).entropy
                      }
                      aria-valuemin={0}
                      aria-valuemax={4}
                      aria-label="Niveau de sécurité du mot de passe"
                    >
                      <div
                        className={cn(
                          getPasswordStrength(form.getValues("password"))
                            .strength === "weak" && "bg-red-400",
                          getPasswordStrength(form.getValues("password"))
                            .strength === "medium" && "bg-yellow-400",
                          getPasswordStrength(form.getValues("password"))
                            .strength === "strong" && "bg-emerald-500",
                          "h-full transition-all duration-500 ease-out"
                        )}
                        style={{
                          width: `${
                            getPasswordStrength(form.getValues("password"))
                              .entropy * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
            S&apos;inscrire
          </Button>
        </form>
      </Form>
    </div>
  );
};
