"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useMediaQuery } from "../ui/use-media-query";
import { handleError } from "@/utils/error-utils";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { useFormatDates } from "@/utils/format";
import { useFormatter } from "next-intl";

export const UpdatePeriodForm = ({
  close,
  period,
  periods,
}: {
  close: () => void;
  period: Period;
  periods: Period[];
}) => {
  const formatter = useFormatter();
  const formatDates = useFormatDates(formatter);

  const errorTranslations = useTranslations("Errors");
  const t = useTranslations("Dashboard.Forms.UpdatePeriod");
  const toaster = useToast();
  const queryClient = useQueryClient();

  const updatePeriodSchema = z.object({
    name: z.string().min(1, t("nameRequired")).max(64, t("nameTooLong")),
    dateRange: z
      .object({
        from: z.date({
          required_error: t("fromRequired"),
        }),
        to: z.date({
          required_error: t("toRequired"),
        }),
      })
      .refine(
        (data) =>
          isBefore(data.from, data.to) ||
          data.from.getTime() === data.to.getTime(),
        {
          message: t("dateRangeError"),
          path: ["to"],
        }
      ),
    isCumulative: z.boolean().optional(),
  });

  type UpdatePeriodSchema = z.infer<typeof updatePeriodSchema>;

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-Period"],
    mutationFn: async ({
      name,
      dateRange,
      isCumulative,
    }: UpdatePeriodSchema) => {
      const res = await apiClient.patch(`periods/${period.id}`, {
        json: {
          name,
          startAt: dateRange.from,
          endAt: dateRange.to,
          isCumulative,
        },
      });

      return res.json();
    },
    onSuccess: () => {
      toaster.toast({
        title: t("successTitle"),
        description: t("successDescription"),
      });

      queryClient.invalidateQueries({ queryKey: ["periods"] });
      queryClient.invalidateQueries({ queryKey: ["period", period.id] });
      queryClient.invalidateQueries({
        queryKey: ["subjects", "organized-by-periods"],
      });

      close();
    },
    onError: (error) => {
      handleError(error, toaster, errorTranslations, t("updateError"));
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
      isCumulative: period.isCumulative || false,
    },
  });

  const numberOfMonths = useMediaQuery("(min-width: 1024px)") ? 2 : 1;

  const onSubmit = (values: UpdatePeriodSchema) => {
    const { from: startAt, to: endAt } = values.dateRange;

    const normalizedStartAt = startOfDay(startAt);
    const normalizedEndAt = startOfDay(endAt);

    // Overlap check
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
        title: t("overlapTitle"),
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
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mx-1">
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("namePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Range Field */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="mx-1">
                <FormLabel>{t("dateRange")}</FormLabel>
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
                              `${formatDates.formatIntermediate(
                                field.value.from
                              )} - ${formatDates.formatIntermediate(
                                field.value.to
                              )}`
                            ) : (
                              formatDates.formatIntermediate(field.value.from)
                            )
                          ) : (
                            <span>{t("selectDateRange")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          excludeDisabled
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={numberOfMonths}
                          disabled={periods
                            .filter((p) => p.id !== period.id)
                            .map((p) => ({
                              from: startOfDay(p.startAt),
                              to: startOfDay(p.endAt),
                            }))}
                          defaultMonth={field.value?.from || new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* isCumulative Switch Field */}
          <FormField
            control={form.control}
            name="isCumulative"
            render={({ field }) => (
              <FormItem className="mx-1">
                <div className="flex flex-row gap-4 items-center">
                  <FormLabel>{t("isCumulative")}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  {t("isCumulativeDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2 h-4 w-4" />}
            {t("submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
};
