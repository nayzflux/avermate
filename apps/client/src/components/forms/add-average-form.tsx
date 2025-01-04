"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {
  Check,
  ChevronsUpDown,
  Loader2Icon,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { Switch } from "@/components/ui/switch";

import { useMediaQuery } from "@/components/ui/use-media-query";
import { useSubjects } from "@/hooks/use-subjects";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { handleError } from "@/utils/error-utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTranslations } from "next-intl";

dayjs.locale("fr");

export const AddAverageForm = ({ close }: { close: () => void }) => {
  const errorTranslations = useTranslations("Errors");
  const t = useTranslations("Dashboard.Forms.AddAverage");
  const toaster = useToast();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [openSubjectIndex, setOpenSubjectIndex] = useState<number | null>(null);

  const { data: subjects } = useSubjects();

  const addCustomAverageSchema = z.object({
    name: z.string().min(1, t("nameRequired")).max(64, t("nameTooLong")),
    subjects: z
      .array(
        z.object({
          id: z.string().min(1, t("subjectIdRequired")),
          customCoefficient: z
            .number()
            .min(1, t("coefficientMin"))
            .max(1000, t("coefficientMax"))
            .nullable()
            .optional(),
          includeChildren: z.boolean().optional(),
        })
      )
      .min(1, t("atLeastOneSubject")),
    isMainAverage: z.boolean().optional().default(false),
  });

  type AddCustomAverageSchema = z.infer<typeof addCustomAverageSchema>;

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationKey: ["create-custom-average"],
    mutationFn: async (formData: AddCustomAverageSchema) => {
      const res = await apiClient.post("averages", {
        json: {
          name: formData.name,
          subjects: formData.subjects,
          isMainAverage: formData.isMainAverage,
        },
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toaster.toast({
        title: t("successTitle"),
        description: t("successDescription"),
      });
      close();
      queryClient.invalidateQueries({ queryKey: ["customAverages"] });
    },
    onError: (error: any) => {
      handleError(error, toaster, errorTranslations, t("errorCreating"));
    },
  });

  const form = useForm<AddCustomAverageSchema>({
    resolver: zodResolver(addCustomAverageSchema),
    defaultValues: {
      name: "",
      subjects: [{ id: "", customCoefficient: null, includeChildren: false }],
      isMainAverage: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const onSubmit = (values: AddCustomAverageSchema) => {
    const filteredSubjects = values.subjects.filter((s) => s.id !== "");
    if (filteredSubjects.length === 0) {
      toaster.toast({
        title: t("error"),
        description: t("selectAtLeastOneSubject"),
        variant: "destructive",
      });
      return;
    }
    mutate({ ...values, subjects: filteredSubjects });
  };

  // Subject selection logic
  const subjectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDesktop && openSubjectIndex !== null) {
      setTimeout(() => subjectInputRef.current?.focus(), 350);
    }
  }, [openSubjectIndex, isDesktop]);

  const setSubjectForIndex = (index: number, subjectId: string) => {
    form.setValue(`subjects.${index}.id`, subjectId, { shouldValidate: true });
    setOpenSubjectIndex(null);
  };

  // Render a single subject field row
  const renderSubjectField = (index: number, fieldItem: { id: string }) => {
    const selectedSubjectId = form.getValues(`subjects.${index}.id`);
    const selectedSubjectName = subjects?.find(
      (s) => s.id === selectedSubjectId
    )?.name;

    return (
      <div
        key={fieldItem.id}
        className="flex flex-col gap-4 border p-4 rounded"
      >
        {/* Subject selection */}
        <FormField
          control={form.control}
          name={`subjects.${index}.id`}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>{t("subject")}</FormLabel>
              {isDesktop ? (
                <Popover
                  modal
                  open={openSubjectIndex === index}
                  onOpenChange={(open) =>
                    setOpenSubjectIndex(open ? index : null)
                  }
                >
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSubjectIndex === index}
                        className="justify-between w-full"
                        disabled={isSubmitting}
                      >
                        {selectedSubjectName || t("chooseSubject")}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)]">
                    <Command>
                      <CommandInput
                        placeholder={t("searchSubject")}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>{t("noSubjectFound")}</CommandEmpty>
                        <CommandGroup>
                          {subjects
                            ?.slice()
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((subject) => (
                              <CommandItem
                                key={subject.id}
                                value={subject.name}
                                onSelect={() =>
                                  setSubjectForIndex(index, subject.id)
                                }
                              >
                                <span>{subject.name}</span>
                                {field.value === subject.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Drawer
                    open={openSubjectIndex === index}
                    onOpenChange={(open) =>
                      setOpenSubjectIndex(open ? index : null)
                    }
                  >
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSubjectIndex === index}
                          className="justify-between w-full"
                          onClick={() => setOpenSubjectIndex(index)}
                          disabled={isSubmitting}
                        >
                          {selectedSubjectName || t("chooseSubject")}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <VisuallyHidden>
                        <DrawerTitle>{t("chooseSubject")}</DrawerTitle>
                      </VisuallyHidden>
                      <div className="mt-4 border-t p-4">
                        <Command>
                          <CommandInput
                            ref={subjectInputRef}
                            placeholder={t("searchSubject")}
                            className="h-9"
                            autoFocus
                          />
                          <CommandList>
                            <CommandEmpty>{t("noSubjectFound")}</CommandEmpty>
                            <CommandGroup>
                              {subjects
                                ?.slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((subject) => (
                                  <CommandItem
                                    key={subject.id}
                                    value={subject.name}
                                    onSelect={() =>
                                      setSubjectForIndex(index, subject.id)
                                    }
                                  >
                                    <span>{subject.name}</span>
                                    {field.value === subject.id && (
                                      <Check className="ml-auto h-4 w-4" />
                                    )}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Custom Coefficient */}
        <FormField
          control={form.control}
          name={`subjects.${index}.customCoefficient`}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>
                {t("customCoefficient")}{" "}
                <Badge className="ml-2">{t("optional")}</Badge>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1"
                  min={1}
                  max={1000}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Include Children */}
        <FormField
          control={form.control}
          name={`subjects.${index}.includeChildren`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4">
              <FormLabel>{t("includeChildren")}</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remove subject button */}
        {fields.length > 1 && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => remove(index)}
            disabled={isSubmitting}
            className="mt-2"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("removeSubject")}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mx-1">
                <FormLabel>{t("customAverageName")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("customAveragePlaceholder")}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* isMainAverage Switch */}
          <FormField
            control={form.control}
            name="isMainAverage"
            render={({ field }) => (
              <FormItem className="mx-1 flex flex-row items-center gap-4">
                <FormLabel>{t("showOnMainPage")}</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subjects */}
          <div className="flex flex-col gap-4 mx-1">
            <FormLabel>{t("subjects")}</FormLabel>
            <div className="flex flex-col gap-4">
              {fields.map((fieldItem, index) =>
                renderSubjectField(index, fieldItem)
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  id: "",
                  customCoefficient: null,
                  includeChildren: false,
                })
              }
              disabled={isSubmitting}
              className="mt-2 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {t("addSubject")}
            </Button>
          </div>

          {/* Submit */}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
            )}
            {t("createCustomAverage")}
          </Button>
        </form>
      </Form>
    </div>
  );
};
