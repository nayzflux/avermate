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
import { cn } from "@/lib/utils";
import { getPasswordStrength } from "@/utils/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8)
    .max(128)
    .superRefine((password, ctx) => {
      const strength = getPasswordStrength(password);

      if (strength.strength === "weak") {
        return ctx.addIssue({
          code: "custom",
          message: "Password is too weak.",
        });
      }
    }),
});

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const router = useRouter();
  const toaster = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async ({ password }: ResetPasswordSchema) => {
      const data = await authClient.resetPassword({
        newPassword: password,
      });

      return data;
    },
    onSuccess: (data) => {
      // Redirect to the dashboard
      router.push("/auth/sign-in");

      // Send toast notification
      toaster.toast({
        title: `Password reset`,
        description: "Your password has been reset successfully!",
      });
    },

    onError: (err) => {
      // TODO: Error handling
      toaster.toast({
        title: "Failed to reset password",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleSubmit = (values: ResetPasswordSchema) => {
    mutate(values);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
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

                    {/* Password strength indicator */}
                    <div
                      className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
                      role="progressbar"
                      aria-valuenow={
                        getPasswordStrength(form.getValues("password")).entropy
                      }
                      aria-valuemin={0}
                      aria-valuemax={4}
                      aria-label="Password strength"
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
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
};
