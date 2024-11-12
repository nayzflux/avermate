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
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddSubjectButton from "../buttons/dashboard/add-subject-button";
import AddSubjectDialog from "../dialogs/add-subject-dialog";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const addSubjectSchema = z.object({
  name: z.string().min(1).max(64),
  coefficient: z.coerce.number().int().min(1).max(1000),
  parentId: z
    .string()
    .max(64)
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

type AddSubjectSchema = z.infer<typeof addSubjectSchema>;

export const AddSubjectForm = ({ close }: { close: () => void }) => {
  const toaster = useToast();

  const queryClient = useQueryClient();

  const { data: subects, isError } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{
        subjects: Subject[];
      }>();
      return data.subjects;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-Subject"],
    mutationFn: async ({ name, coefficient, parentId }: AddSubjectSchema) => {
      const res = await apiClient.post("subjects", {
        json: {
          name,
          coefficient,
          parentId,
        },
      });

      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      // Send toast notification
      toaster.toast({
        title: `Matière ajouter avec succès !`,
        description:
          "Ajouter des notes à cette matière pour commencer à suivre votre progression.",
      });

      close();

      queryClient.invalidateQueries({
        queryKey: ["Subjects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["subjects"],
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

  const form = useForm<AddSubjectSchema>({
    resolver: zodResolver(addSubjectSchema),
    defaultValues: {
      name: "",
      parentId: "",
    },
  });

  const onSubmit = (values: AddSubjectSchema) => {
    mutate(values);
  };

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>

                <FormControl>
                  <Input type="text" placeholder="Mathématiques" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coefficient"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Coefficient</FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sous-matière <Badge className="ml-2">Optionnel</Badge>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        className="placeholder:text-muted-foreground text-blue-500"
                        placeholder="Choisir une matière parente"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subects?.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2 size-4" />}
            Ajouter une matière
          </Button>
        </form>
      </Form>
    </div>
  );
};
