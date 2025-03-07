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
import { CardTemplate, CardLayoutItem } from "@/hooks/use-card-layouts";
import { useTranslations } from "next-intl";
import * as HeroIcons from "@heroicons/react/24/outline";
import { builtInCardConfigs } from "@/components/dashboard/dynamic-data-card";
import { TimeRangeSelect } from "../dashboard/time-range-select";

interface CustomizeCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: CardTemplate;
  layoutItem: CardLayoutItem;
  page: "dashboard" | "grade" | "subject";
  allCards: CardLayoutItem[];
  onSave: (updatedLayoutItem: CardLayoutItem) => void;
}

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

  // Update the type definition for CardLayoutItem to include customization properties
  interface CardLayoutItem {
    templateId: string;
    position: number;
    customization?: {
      title?: string | null;
      icon?: string | null;
      description?: {
        template?: string | null;
        variables?: Record<string, any>;
      };
      mainData?: {
        params?: Record<string, any>;
        calculator?: string | null;
      };
    };
  }

  // State for customization values
  const [customization, setCustomization] = useState<{
    title?: string | null;
    icon?: string | null;
    description: {
      template?: string | null;
      variables: Record<string, any>;
    };
    mainData: {
      params: Record<string, any>;
      calculator?: string | null;
    };
  }>({
    title: layoutItem.customization?.title || null,
    icon: layoutItem.customization?.icon || null,
    description: {
      template: layoutItem.customization?.description?.template || null,
      variables: layoutItem.customization?.description?.variables || {},
    },
    mainData: {
      params: layoutItem.customization?.mainData?.params || {},
      calculator: layoutItem.customization?.mainData?.calculator || null,
    },
  });

  // Check if this is a built-in card
  const isBuiltInCard = template.id in builtInCardConfigs;
  const builtInConfig = isBuiltInCard
    ? builtInCardConfigs[template.id]
    : undefined;
  const isCustomAverageCard =
    template.config?.mainData?.calculator === "customAverage";

  // Reset customization when template changes
  useEffect(() => {
    setCustomization({
      title: layoutItem.customization?.title || null,
      icon: layoutItem.customization?.icon || null,
      description: {
        template: layoutItem.customization?.description?.template || null,
        variables: layoutItem.customization?.description?.variables || {},
      },
      mainData: {
        params: layoutItem.customization?.mainData?.params || {},
        calculator: layoutItem.customization?.mainData?.calculator || null,
      },
    });
  }, [layoutItem, template]);

  // Handle save
  const handleSave = () => {
    // Remove null values to avoid unnecessary customization entries
    const cleanedCustomization: any = {};

    if (customization.title) {
      cleanedCustomization.title = customization.title;
    }

    if (customization.icon) {
      cleanedCustomization.icon = customization.icon;
    }

    if (
      customization.description.template ||
      Object.keys(customization.description.variables).length > 0
    ) {
      cleanedCustomization.description = {
        ...(customization.description.template
          ? { template: customization.description.template }
          : {}),
        ...(Object.keys(customization.description.variables).length > 0
          ? { variables: customization.description.variables }
          : {}),
      };
    }

    if (
      customization.mainData.calculator ||
      Object.keys(customization.mainData.params).length > 0
    ) {
      cleanedCustomization.mainData = {
        ...(customization.mainData.calculator
          ? { calculator: customization.mainData.calculator }
          : {}),
        ...(Object.keys(customization.mainData.params).length > 0
          ? { params: customization.mainData.params }
          : {}),
      };
    }

    // Create updated layout item
    const updatedLayoutItem = {
      ...layoutItem,
      ...(Object.keys(cleanedCustomization).length > 0
        ? { customization: cleanedCustomization }
        : {}),
    };

    onSave(updatedLayoutItem);
    onOpenChange(false);
  };

  // Handle title change
  const updateTitle = (title: string) => {
    setCustomization({
      ...customization,
      title: title || null,
    });
  };

  // Handle icon change
  const updateIcon = (icon: string) => {
    setCustomization({
      ...customization,
      icon: icon || null,
    });
  };

  // Handle time range change
  const updateTimeRange = (timeRange: string) => {
    setCustomization({
      ...customization,
      mainData: {
        ...customization.mainData,
        params: {
          ...customization.mainData.params,
          timeRange,
        },
      },
    });
  };

  // Get available time ranges
  const getAvailableTimeRanges = () => {
    if (builtInConfig?.allowedTimeRanges) {
      return builtInConfig.allowedTimeRanges;
    }
    return ["sinceStart", "thisWeek", "thisMonth", "thisYear"];
  };

  // Get current time range
  const getCurrentTimeRange = () => {
    return (
      customization.mainData.params.timeRange ||
      builtInConfig?.defaultTimeRange ||
      "sinceStart"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title customization - only if allowed */}
          {(!isBuiltInCard ||
            (builtInConfig && builtInConfig.allowTitleCustomization)) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                {t("cardTitle")}
              </Label>
              <Input
                id="title"
                value={customization.title || template.config.title}
                onChange={(e) => updateTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}

          {/* Icon customization - only if allowed */}
          {(!isBuiltInCard ||
            (builtInConfig && builtInConfig.allowIconCustomization)) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                {t("icon")}
              </Label>
              <Select
                value={customization.icon || template.config.icon}
                onValueChange={updateIcon}
              >
                <SelectTrigger id="icon" className="col-span-3">
                  <SelectValue placeholder={t("selectIcon")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(HeroIcons)
                    .filter((key) => key.endsWith("Icon"))
                    .map((iconName) => (
                      <SelectItem key={iconName} value={iconName}>
                        {iconName.replace("Icon", "")}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Time range customization for global average */}
          {isBuiltInCard &&
            builtInConfig?.customizableParams?.includes("timeRange") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timeRange" className="text-right">
                  {t("timeRange")}
                </Label>
                <TimeRangeSelect
                  value={getCurrentTimeRange()}
                  options={getAvailableTimeRanges()}
                  onValueChange={updateTimeRange}
                  translations={t}
                  className="col-span-3"
                />
              </div>
            )}

          {/* Add more customization options based on card type */}
          {/* For example, custom average ID selector for custom average cards */}
          {isCustomAverageCard && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customAverageId" className="text-right">
                {t("customAverage")}
              </Label>
              <Input
                id="customAverageId"
                value={customization.mainData.params.customAverageId || ""}
                onChange={(e) => {
                  setCustomization({
                    ...customization,
                    mainData: {
                      ...customization.mainData,
                      params: {
                        ...customization.mainData.params,
                        customAverageId: e.target.value,
                      },
                    },
                  });
                }}
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
