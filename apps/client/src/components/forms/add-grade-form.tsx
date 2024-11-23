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
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const addGradeSchema = z.object({
  name: z.string().min(1).max(64),
  outOf: z.coerce.number().min(0).max(1000),
  value: z.coerce.number().min(0).max(1000),
  coefficient: z.coerce.number().min(0).max(1000),
  passedAt: z.date(),
  subjectId: z.string().min(1).max(64),
});

type AddGradeSchema = z.infer<typeof addGradeSchema>;

export const AddGradeForm = ({ close }: { close: () => void }) => {
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
    mutationKey: ["create-grade"],
    mutationFn: async ({
      name,
      outOf,
      value,
      coefficient,
      passedAt,
      subjectId,
    }: AddGradeSchema) => {
      const res = await apiClient.post("grades", {
        json: {
          name,
          value,
          outOf,
          coefficient,
          passedAt,
          subjectId,
        },
      });

      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      // Send toast notification
      toaster.toast({
        title: `Notes ajouter avec succès !`,
        description: "Vous pouvez à présent suivre votre évolution.",
      });

      close();

      queryClient.invalidateQueries({
        queryKey: ["grades"],
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

  const form = useForm<AddGradeSchema>({
    resolver: zodResolver(addGradeSchema),
    defaultValues: {
      name: "",
      subjectId: "",
    },
  });

  const onSubmit = (values: AddGradeSchema) => {
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
                  <Input
                    type="text"
                    placeholder="DS: Nombres complexes"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="value"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      placeholder="13.5"
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
              name="outOf"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sur</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      placeholder="20"
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
          </div>

          <FormField
            control={form.control}
            name="passedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel htmlFor="">Passé le</FormLabel>

                <Popover modal>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value).format("dddd DD MMM YYYY")
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("2023-01-02")
                      }
                      initialFocus
                      weekStartsOn={1}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matière</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        className="placeholder:text-muted-foreground text-blue-500"
                        placeholder="Choisir une matière"
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
            Ajouter ma note
          </Button>
        </form>
      </Form>
    </div>
  );
};
