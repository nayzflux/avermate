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
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "@/components/ui/switch";

const updateSubjectSchema = z.object({
  name: z.string().min(1).max(64),
  coefficient: z.coerce.number().min(0).max(1000),
  parentId: z
    .string()
    .max(64)
    .optional()
    .transform((val) => (val === "none" ? null : val))
    .nullable(),
  isMainSubject: z.boolean().optional(),
  isDisplaySubject: z.boolean().optional(),
});

type UpdateSubjectSchema = z.infer<typeof updateSubjectSchema>;

export const UpdateSubjectForm = ({
  close,
  subject,
}: {
  close: () => void;
  subject: Subject;
}) => {
  const toaster = useToast();

  const queryClient = useQueryClient();

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{
        subjects: Subject[];
      }>();
      return data.subjects;
    },
  });
    
  const filteredSubjects = subjects?.filter((s) => s.id !== subject.id);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-subject"],
    mutationFn: async ({
      name,
      coefficient,
      parentId,
      isMainSubject,
      isDisplaySubject,
    }: UpdateSubjectSchema) => {
        console.log(parentId);
      const res = await apiClient.patch(`subjects/${subject.id}`, {
        json: {
          name,
          coefficient,
          parentId,
          isMainSubject,
          isDisplaySubject,
        },
      });
        
      const data = await res.json<{ subject: Subject }>();
      return data.subject;
    },
    onSuccess: () => {
      toaster.toast({
        title: `Matière modifiée avec succès !`,
        description: "Votre matière a été mise à jour.",
      });

      close();

      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["subject", subject.id],
      });
    },

    onError: () => {
      toaster.toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour la matière. Réessayer plus tard.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<UpdateSubjectSchema>({
    resolver: zodResolver(updateSubjectSchema),
    defaultValues: {
      name: subject.name,
      coefficient: subject.coefficient / 100,
      parentId: subject.parentId ?? "none",
      isMainSubject: subject.isMainSubject,
      isDisplaySubject: subject.isDisplaySubject,
    },
  });

  const onSubmit = (values: UpdateSubjectSchema) => {
    mutate(values);
  };

  return (
    <div>
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
                  <Input type="text" placeholder={subject.name} {...field} />
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
              <FormItem>
                <FormLabel>Coefficient</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={(subject.coefficient / 100).toString()}
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
            name="isMainSubject"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-4 items-center">
                <FormLabel>Matière principale</FormLabel>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isDisplaySubject"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-4 items-center">
                <FormLabel>Catégorie</FormLabel>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
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
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Choisir une matière parente"
                        className="text-blue-500 placeholder:text-muted-foreground"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No parent</SelectItem>
                    {filteredSubjects?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
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
            Modifier la matière
          </Button>
        </form>
      </Form>
    </div>
  );
};
