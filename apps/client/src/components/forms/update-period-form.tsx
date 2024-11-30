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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isBefore, isWithinInterval, startOfDay } from "date-fns";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "../ui/calendar";

const updatePeriodSchema = z.object({
  name: z.string().min(1).max(64),
  dateRange: z
    .object({
      from: z.date({
        required_error: "La date de début est requise",
      }),
      to: z.date({
        required_error: "La date de fin est requise",
      }),
    })
    .refine(
      (data) =>
        isBefore(data.from, data.to) ||
        data.from.getTime() === data.to.getTime(),
      {
        message:
          "La date de début doit être antérieure ou égale à la date de fin",
        path: ["to"],
      }
    ),
});

type UpdatePeriodSchema = z.infer<typeof updatePeriodSchema>;

export const UpdatePeriodForm = ({
  close,
  period,
  periods,
}: {
  close: () => void;
  period: Period;
  periods: Period[];
}) => {
  const toaster = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-Period"],
    mutationFn: async ({ name, dateRange }: UpdatePeriodSchema) => {
      const res = await apiClient.patch(`periods/${period.id}`, {
        json: {
          name,
          startAt: dateRange.from,
          endAt: dateRange.to,
        },
      });

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toaster.toast({
        title: "Période mise à jour",
        description: "La période a été modifiée avec succès.",
      });

      queryClient.invalidateQueries({ queryKey: ["periods"] });
      queryClient.invalidateQueries({ queryKey: ["period", period.id] });

      close();
    },
    onError: () => {
      toaster.toast({
        title: "Erreur",
        description: "Impossible de modifier la période. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<UpdatePeriodSchema>({
    resolver: zodResolver(updatePeriodSchema),
    defaultValues: {
      name: period.name,
      dateRange: {
        from: new Date(period.startAt),
        to: new Date(period.endAt),
      },
    },
  });

  const onSubmit = (values: UpdatePeriodSchema) => {
    const { from: startAt, to: endAt } = values.dateRange;

    const normalizedStartAt = startOfDay(startAt);
    const normalizedEndAt = startOfDay(endAt);

    const overlappingPeriod = periods.find((p) => {
      if (p.id === period.id) return false; // Skip current period
      const normalizedPeriodStartAt = startOfDay(p.startAt);
      const normalizedPeriodEndAt = startOfDay(p.endAt);

      return (
        isWithinInterval(normalizedStartAt, {
          start: normalizedPeriodStartAt,
          end: normalizedPeriodEndAt,
        }) ||
        isWithinInterval(normalizedEndAt, {
          start: normalizedPeriodStartAt,
          end: normalizedPeriodEndAt,
        }) ||
        (normalizedPeriodStartAt >= normalizedStartAt &&
          normalizedPeriodEndAt <= normalizedEndAt)
      );
    });

    if (overlappingPeriod) {
      toaster.toast({
        title: "Les périodes se chevauchent",
        variant: "destructive",
      });
      return;
    }

    mutate(values);
  };

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nom de la période"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de la période</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={
                            !field.value?.from ? "text-muted-foreground" : ""
                          }
                        >
                          {field.value?.from ? (
                            field.value.to ? (
                              `${format(field.value.from, "PPP")} - ${format(
                                field.value.to,
                                "PPP"
                              )}`
                            ) : (
                              format(field.value.from, "PPP")
                            )
                          ) : (
                            <span>Sélectionner une plage de dates</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          weekStartsOn={1}
                          excludeDisabled
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={3}
                          disabled={periods
                          .filter((p) => p.id !== period.id)
                          .map((p) => ({
                            from: startOfDay(p.startAt),
                            to: startOfDay(p.endAt),
                          }))}
                        />
                        </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2 h-4 w-4" />}
            Modifier la période
          </Button>
        </form>
      </Form>
    </div>
  );
};