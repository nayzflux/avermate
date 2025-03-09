"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as HeroIcons from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { builtInCardConfigs } from "@/components/dashboard/dynamic-data-card";
import { TimeRangeSelect } from "../dashboard/time-range-select";

// Replace with your own types/hooks:
import type { CardTemplate, CardLayoutItem } from "@/hooks/use-card-layouts";
import { useUpdateCard } from "@/hooks/use-card-layouts";

interface CustomizeCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** The DB row for this card. We'll update template.config on save. */
  template: CardTemplate;

  /** Layout item referencing this card, only if you still need it for some reason. */
  layoutItem: CardLayoutItem;

  /** Which page we’re on, e.g. “dashboard” | “grade” | “subject” */
  page: "dashboard" | "grade" | "subject";

  /** All items in the layout, if you still need them. */
  allCards: CardLayoutItem[];

  /** Callback if you want to do anything after a successful save. */
  onSave: (updatedLayoutItem: CardLayoutItem) => void;
}

/**
 * A dialog that:
 * - Honors built-in-card restrictions (title/icon/timeRange, etc.)
 * - Edits `template.config` in the DB (rather than storing overrides in `layoutItem.customization`).
 */
export default function CustomizeCardDialog({
  open,
  onOpenChange,
  template,
  layoutItem,
  page,
  allCards,
  onSave,
}: CustomizeCardDialogProps) {
  const t = useTranslations("Dashboard.Components.CustomizeCard");
  const { mutate: updateCardTemplate } = useUpdateCard();

  // 1) Determine if this is a built-in or custom card,
  //    then get the built-in config if applicable
  const isBuiltInCard = template.id in builtInCardConfigs;
  const builtInConfig = isBuiltInCard
    ? builtInCardConfigs[template.id]
    : undefined;

  // 2) Also check if it’s a customAverage card
  //    so we can show the “customAverageId” field
  //    (assuming template.config is an object!)
  const parsedTemplateConfig =
    typeof template.config === "string"
      ? JSON.parse(template.config)
      : template.config;

  const isCustomAverageCard =
    parsedTemplateConfig?.mainData?.calculator === "customAverage";

  // 3) Local state. We’re effectively letting the user
  //    override some fields from the template config.
  //    If the card is built-in, we only let them edit
  //    the fields that builtInConfig says are allowed.
  const [title, setTitle] = useState<string>(parsedTemplateConfig.title || "");
  const [icon, setIcon] = useState<string>(
    parsedTemplateConfig.icon || "ChartBarIcon"
  );
  const [timeRange, setTimeRange] = useState<string>(
    parsedTemplateConfig.mainData?.params?.timeRange || "sinceStart"
  );
  const [customAverageId, setCustomAverageId] = useState<string>(
    parsedTemplateConfig.mainData?.params?.customAverageId || ""
  );

  // Reset local state each time this dialog re-opens with a new template
  useEffect(() => {
    if (open) {
      const cfg =
        typeof template.config === "string"
          ? JSON.parse(template.config)
          : template.config;

      setTitle(cfg.title || "");
      setIcon(cfg.icon || "ChartBarIcon");
      setTimeRange(cfg.mainData?.params?.timeRange || "sinceStart");
      setCustomAverageId(cfg.mainData?.params?.customAverageId || "");
    }
  }, [open, template]);

  // 4) Save logic. We only save changes to `template.config` in the DB
  const handleSave = () => {
    // Merge old config with new user-entered fields
    const oldConfig = parsedTemplateConfig;

    // Build the new config object:
    const newConfig = {
      ...oldConfig,
      // Only override title if builtIn card + allowed, or it’s custom
      title:
        !isBuiltInCard ||
        (builtInConfig && builtInConfig.allowTitleCustomization)
          ? title
          : oldConfig.title,
      // Same approach for icon
      icon:
        !isBuiltInCard ||
        (builtInConfig && builtInConfig.allowIconCustomization)
          ? icon
          : oldConfig.icon,
      mainData: {
        ...oldConfig.mainData,
        params: {
          ...oldConfig.mainData?.params,
          // If builtIn says “timeRange” is customizable, store it;
          // otherwise keep the old timeRange
          timeRange:
            isBuiltInCard &&
            builtInConfig?.customizableParams?.includes("timeRange")
              ? timeRange
              : oldConfig.mainData?.params?.timeRange,

          // If it’s a customAverage card, store the customAverageId
          // (only if that’s indeed how you want it).
          ...(isCustomAverageCard ? { customAverageId } : {}),
        },
      },
    };

    // 5) Call your mutation hook to push this updated config to the DB
    updateCardTemplate({
      ...template,
      config: newConfig,
    });

    // If you still want to do some layout-based callback:
    // your old code had "updatedLayoutItem" – we can just re-pass
    // the same item or omit it. For now we’ll keep it minimal:
    onSave(layoutItem);

    // Close the dialog
    onOpenChange(false);
  };

  // 6) Helper for built-in time ranges
  const getAvailableTimeRanges = () =>
    builtInConfig?.allowedTimeRanges || [
      "sinceStart",
      "thisWeek",
      "thisMonth",
      "thisYear",
    ];

  // 7) Rendering:
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title input – only if custom or if builtIn allows it */}
          {(!isBuiltInCard ||
            (builtInConfig && builtInConfig.allowTitleCustomization)) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                {t("cardTitle")}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}

          {/* Icon select – only if custom or if builtIn allows it */}
          {(!isBuiltInCard ||
            (builtInConfig && builtInConfig.allowIconCustomization)) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                {t("icon")}
              </Label>
              <Select value={icon} onValueChange={(value) => setIcon(value)}>
                <SelectTrigger id="icon" className="col-span-3">
                  <SelectValue placeholder={t("selectIcon")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(HeroIcons)
                    .filter((k) => k.endsWith("Icon"))
                    .map((iconName) => {
                      const IconComp = (HeroIcons as any)[iconName];
                      return (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center gap-2">
                            <IconComp className="h-5 w-5" />
                            <span>{iconName.replace("Icon", "")}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Time range – only if builtIn config says it’s customizable */}
          {isBuiltInCard &&
            builtInConfig?.customizableParams?.includes("timeRange") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timeRange" className="text-right">
                  {t("timeRange")}
                </Label>
                <TimeRangeSelect
                  value={timeRange}
                  options={getAvailableTimeRanges()}
                  onValueChange={(val) => setTimeRange(val)}
                  translations={t}
                  className="col-span-3"
                />
              </div>
            )}

          {/* If it's a customAverage card, show a customAverageId input */}
          {isCustomAverageCard && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customAverageId" className="text-right">
                {t("customAverage")}
              </Label>
              <Input
                id="customAverageId"
                value={customAverageId}
                onChange={(e) => setCustomAverageId(e.target.value)}
                className="col-span-3"
                placeholder={t("customAverageIdPlaceholder")}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
