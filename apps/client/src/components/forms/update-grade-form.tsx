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
import { Grade } from "@/types/grade";
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
import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React from "react";
import { Check } from "lucide-react";
import { FormDescription } from "@/components/ui/form";
import { ChevronsUpDown } from "lucide-react";

const updateGradeSchema = z.object({
  name: z.string().min(1).max(64),
  outOf: z.coerce.number().min(0).max(1000),
  value: z.coerce.number().min(0).max(1000),
  coefficient: z.coerce.number().min(0).max(1000),
  passedAt: z.date(),
  subjectId: z.string().min(1).max(64),
  periodId: z.string().min(1).max(64),
});

type UpdateGradeSchema = z.infer<typeof updateGradeSchema>;

export const UpdateGradeForm = ({
  close,
  grade,
}: {
  close: () => void;
  grade: Grade;
}) => {
  const [open, setOpen] = useState(false);
  const [openSubjectPopover, setOpenSubjectPopover] = useState(false);
  const toaster = useToast();

  const queryClient = useQueryClient();

  const { data: subjects, isError } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{
        subjects: Subject[];
      }>();
      return data.subjects;
    },
  });

  const { data: periods, isError: isPeriodsError } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await apiClient.get("periods");
      const data = await res.json<{
        periods: { id: string; name: string }[];
      }>();
      return data.periods;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-grade"],
    mutationFn: async ({
      name,
      outOf,
      value,
      coefficient,
      passedAt,
      subjectId,
      periodId,
    }: UpdateGradeSchema) => {
      const res = await apiClient.patch(`grades/${grade.id}`, {
        json: {
          name,
          value,
          outOf,
          coefficient,
          passedAt,
          subjectId,
          periodId,
        },
      });

      const data = await res.json<{ grade: Grade }>();
      return data.grade;
    },
    onSuccess: (data) => {
      // Send toast notification
      toaster.toast({
        title: `Notes modifier avec succès !`,
        description: "Votre note a été mise à jour.",
      });

      close();

      queryClient.invalidateQueries({
        queryKey: ["grades"],
      });

      queryClient.invalidateQueries({
        queryKey: ["grade", grade.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
    },

    onError: (err) => {
      // TODO: Error handling
      toaster.toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour la note. Réessayer plus tard.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<UpdateGradeSchema>({
    resolver: zodResolver(updateGradeSchema),
    defaultValues: {
      name: grade.name,
      outOf: grade.outOf / 100,
      value: grade.value / 100,
      coefficient: grade.coefficient / 100,
      passedAt: new Date(grade.passedAt),
      subjectId: grade.subjectId,
      periodId: grade.periodId,
    },
  });

  const onSubmit = (values: UpdateGradeSchema) => {
    mutate(values);
  };

  const determinePeriodId = (
    date: string | number | Date | dayjs.Dayjs | null | undefined,
    periods: any[] | undefined
  ) => {
    if (!date || !periods) return "";
    const formattedDate = dayjs(date);
    const matchedPeriod = periods.find(
      (period) =>
        formattedDate.isAfter(dayjs(period.startAt)) &&
        formattedDate.isBefore(dayjs(period.endAt))
    );
    return matchedPeriod ? matchedPeriod.id : "";
  };

  // Automatically set the periodId when passedAt changes
  useEffect(() => {
    const passedAt = form.watch("passedAt");
    if (passedAt) {
      const matchedPeriodId = determinePeriodId(passedAt, periods);
      console.log("matchedPeriodId", matchedPeriodId);
      form.setValue("periodId", matchedPeriodId, { shouldValidate: true });
    }
  }, [form.watch("passedAt"), periods]);

  const selectedPeriod = periods?.find(
    (period) => period.id === form.getValues("periodId")
  );

  const selectedSubject = subjects?.find(
    (subject) => subject.id === form.getValues("subjectId")
  );

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
                  <Input type="text" placeholder={grade.name} {...field} />
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
                      placeholder={(grade.value / 100).toFixed(2)}
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
                      placeholder={(grade.outOf / 100).toFixed(2)}
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
                      placeholder={(grade.coefficient / 100).toFixed(2)}
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
              name="periodId"
              render={({ field }) => {
                const [periodInputValue, setPeriodInputValue] = useState('');

                useEffect(() => {
                if (open) {
                  setPeriodInputValue(selectedPeriod?.name || '');
                }
                }, [open, selectedPeriod]);

                return (
                <FormItem className="flex flex-col">
                  <FormLabel className="pointer-events-none">Période</FormLabel>

                  <Popover
                  modal
                  open={open}
                  onOpenChange={(isOpen) => setOpen(isOpen)}
                  >
                  <FormControl>
                    <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open ? 'true' : 'false'}
                      className="justify-between"
                    >
                      {selectedPeriod
                      ? selectedPeriod.name
                      : 'Choisir une période'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent
                    className="p-0 min-w-[var(--radix-popover-trigger-width)]"
                    align="start"
                  >
                    <Command>
                    <CommandInput
                      placeholder="Choisir une période"
                      value={periodInputValue}
                      onValueChange={setPeriodInputValue}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Aucune période trouvée</CommandEmpty>
                      <CommandGroup>
                      {periods?.map((period) => (
                        <CommandItem
                        key={period.id}
                        value={period.name}
                        onSelect={() => {
                          form.setValue('periodId', period.id, {
                          shouldValidate: true,
                          });
                          setOpen(false);
                        }}
                        >
                        <span>{period.name}</span>
                        {form.getValues('periodId') === period.id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                        </CommandItem>
                      ))}
                      </CommandGroup>
                    </CommandList>
                    </Command>
                  </PopoverContent>
                  </Popover>
                  <FormMessage />
                  <FormDescription>
                  Une note doit être associée à une période. Celle ci peut être
                  différente de la date de passage si besoin.
                  </FormDescription>
                </FormItem>
                );
              }}
              />

              <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => {
                const [subjectInputValue, setSubjectInputValue] = useState('');

                useEffect(() => {
                if (openSubjectPopover) {
                  setSubjectInputValue(selectedSubject?.name || '');
                }
                }, [openSubjectPopover, selectedSubject]);

                return (
                <FormItem className="flex flex-col">
                  <FormLabel className="pointer-events-none">Matière</FormLabel>

                  <Popover
                  modal
                  open={openSubjectPopover}
                  onOpenChange={(isOpen) => setOpenSubjectPopover(isOpen)}
                  >
                  <FormControl>
                    <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSubjectPopover ? 'true' : 'false'}
                      className="justify-between"
                    >
                      {selectedSubject
                      ? selectedSubject.name
                      : 'Choisir une matière'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent
                    className="p-0 min-w-[var(--radix-popover-trigger-width)]"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        placeholder="Choisir une matière"
                        value={subjectInputValue}
                        onValueChange={setSubjectInputValue}
                        className="h-9"
                      />
                      <CommandList>
                      <CommandEmpty>Aucune matière trouvée</CommandEmpty>
                      <CommandGroup>
                      {subjects
                        ?.filter(
                        (subject) => subject.isDisplaySubject === false
                        )
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((subject) => (
                        <CommandItem
                          key={subject.id}
                          value={subject.name}
                          onSelect={() => {
                          form.setValue('subjectId', subject.id, {
                            shouldValidate: true,
                          });
                          setOpenSubjectPopover(false);
                          }}
                        >
                          <span>{subject.name}</span>
                          {form.getValues('subjectId') === subject.id && (
                          <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    </Command>
                  </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
                );
              }}
              />

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2 size-4" />}
            Modifier la note
          </Button>
        </form>
      </Form>
    </div>
  );
};
