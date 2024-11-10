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

const updateNameSchema = z.object({
  name: z.string().min(1).max(64),
});

type UpdateNameSchema = z.infer<typeof updateNameSchema>;

export const UpdateNameForm = ({ defaultName }: { defaultName: string }) => {
  const toaster = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-name"],
    mutationFn: async ({ name }: UpdateNameSchema) => {
      const data = await authClient.updateUser({
        name,
      });
      return data;
    },
    onSuccess: () => {
      // Send toast notification
      toaster.toast({
        title: `Success`,
        description: "Your name has been successfully updated!",
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

  const form = useForm<UpdateNameSchema>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: defaultName,
    },
  });

  const handleSubmit = (values: UpdateNameSchema) => {
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
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder={defaultName} {...field} />
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