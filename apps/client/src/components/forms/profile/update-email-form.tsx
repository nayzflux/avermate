"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateEmailSchema = z.object({
  email: z.string().min(1).max(64),
});

type UpdateEmailSchema = z.infer<typeof updateEmailSchema>;

export const UpdateEmailForm = ({ defaultEmail }: { defaultEmail?: string }) => {
  const toaster = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-email"],
    mutationFn: async ({ email }: UpdateEmailSchema) => {
      const data = await authClient.changeEmail({
        newEmail: email,
      });
      return data;
    },
    onSuccess: () => {
      // Send toast notification
      toaster.toast({
        title: `Success`,
        description: "Your email has been successfully updated!",
      });
    },

    onError: (err) => {
      // TODO: Error handling
      toaster.toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<UpdateEmailSchema>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  const handleSubmit = (values: UpdateEmailSchema) => {
    mutate(values);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="w-full">
            <FormField
              control={form.control}
              name="email"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder={defaultEmail} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full justify-end">
            <Button type="submit" variant="outline" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
