import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateCardTemplate,
  useUpdateCardLayout,
  useCardLayout,
  type CardTemplate,
} from "@/hooks/use-card-layouts";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { PlusCircle } from "lucide-react";
import * as HeroIcons from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";
import { TimeRangeSelect } from "./time-range-select";

interface AddCardTemplateProps {
  page?: "dashboard" | "grade" | "subject";
}

type MainDataType = "grade" | "average" | "impact" | "text" | "custom";
type CalculatorType =
  | "globalAverage"
  | "customAverage"
  | "bestGrade"
  | "worstGrade"
  | "bestSubject"
  | "worstSubject"
  | "gradeImpact";

type MainDataParams = {
  timeRange: string;
  customAverageId?: string;
};

export default function AddCardTemplate({
  page: defaultPage = "dashboard",
}: AddCardTemplateProps) {
  const t = useTranslations("Dashboard.Components.AddCardTemplate");
  const [open, setOpen] = useState(false);
  const { mutate: createTemplate, isPending: isCreatingTemplate } =
    useCreateCardTemplate();
  const { mutate: updateLayout, isPending: isUpdatingLayout } =
    useUpdateCardLayout();
  const { data: currentLayout } = useCardLayout(defaultPage);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: "custom" as const,
    identifier: "",
    config: {
      title: "",
      description: {
        template: "Your performance is {growth} {timeRange}",
        variables: {},
      },
      mainData: {
        type: "average" as MainDataType,
        calculator: "globalAverage" as CalculatorType,
        params: {
          timeRange: "sinceStart",
        } as MainDataParams,
      },
      icon: "ChartBarIcon",
    },
  });

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleSubmit = () => {
    if (!formData.identifier) {
      toast({
        title: t("errorIdentifierRequired"),
        variant: "destructive",
      });
      return;
    }

    if (!formData.config.title) {
      toast({
        title: t("errorTitleRequired"),
        variant: "destructive",
      });
      return;
    }

    createTemplate(formData, {
      onSuccess: (_data: unknown, _variables: unknown, _context: unknown) => {
        const data = _data as { template: CardTemplate };
        const page = defaultPage;

        // Get existing cards from the layout
        const existingCards = currentLayout?.cards || [];
        const parsedCards =
          typeof existingCards === "string"
            ? JSON.parse(existingCards)
            : existingCards;

        // Create new card
        const newCard = {
          templateId: data.template.id,
          position: parsedCards.length,
        };

        // Update layout with new card
        updateLayout(
          {
            page,
            cards: [...parsedCards, newCard],
          },
          {
            onSuccess: () => {
              toast({
                title: t("cardCreated"),
              });
              setOpen(false);
              setFormData({
                type: "custom",
                identifier: "",
                config: {
                  title: "",
                  description: {
                    template: "Your performance is {growth} {timeRange}",
                    variables: {},
                  },
                  mainData: {
                    type: "average" as MainDataType,
                    calculator: "globalAverage" as CalculatorType,
                    params: {
                      timeRange: "sinceStart",
                    } as MainDataParams,
                  },
                  icon: "ChartBarIcon",
                },
              });
              setStep(1);
            },
          }
        );
      },
    });
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateIcon = (iconName: string) => {
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        icon: iconName,
      },
    });
  };

  const updateTimeRange = (timeRange: string) => {
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        mainData: {
          ...formData.config.mainData,
          params: {
            ...formData.config.mainData.params,
            timeRange,
          },
        },
      },
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">{t("title")}</Label>
              <Input
                id="title"
                value={formData.config.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    config: { ...formData.config, title: e.target.value },
                  })
                }
                placeholder={t("titlePlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="identifier">{t("identifier")}</Label>
              <Input
                id="identifier"
                value={formData.identifier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    identifier: e.target.value,
                  })
                }
                placeholder={t("identifierPlaceholder")}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("identifierHelp")}
              </p>
            </div>

            <div>
              <Label htmlFor="icon">{t("icon")}</Label>
              <Select value={formData.config.icon} onValueChange={updateIcon}>
                <SelectTrigger id="icon">
                  <SelectValue placeholder={t("selectIcon")} />
                </SelectTrigger>
                <SelectContent className="h-[300px]">
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
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="calculator">{t("calculator")}</Label>
              <Select
                value={formData.config.mainData.calculator}
                onValueChange={(value: CalculatorType) =>
                  setFormData({
                    ...formData,
                    config: {
                      ...formData.config,
                      mainData: {
                        ...formData.config.mainData,
                        calculator: value,
                      },
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="globalAverage">
                    {t("calculators.globalAverage")}
                  </SelectItem>
                  <SelectItem value="customAverage">
                    {t("calculators.customAverage")}
                  </SelectItem>
                  <SelectItem value="bestGrade">
                    {t("calculators.bestGrade")}
                  </SelectItem>
                  <SelectItem value="worstGrade">
                    {t("calculators.worstGrade")}
                  </SelectItem>
                  <SelectItem value="bestSubject">
                    {t("calculators.bestSubject")}
                  </SelectItem>
                  <SelectItem value="worstSubject">
                    {t("calculators.worstSubject")}
                  </SelectItem>
                  <SelectItem value="gradeImpact">
                    {t("calculators.gradeImpact")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dataType">{t("dataType")}</Label>
              <Select
                value={formData.config.mainData.type}
                onValueChange={(value: MainDataType) =>
                  setFormData({
                    ...formData,
                    config: {
                      ...formData.config,
                      mainData: {
                        ...formData.config.mainData,
                        type: value,
                      },
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade">{t("dataTypes.grade")}</SelectItem>
                  <SelectItem value="average">
                    {t("dataTypes.average")}
                  </SelectItem>
                  <SelectItem value="impact">
                    {t("dataTypes.impact")}
                  </SelectItem>
                  <SelectItem value="text">{t("dataTypes.text")}</SelectItem>
                  <SelectItem value="custom">
                    {t("dataTypes.custom")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.config.mainData.calculator === "globalAverage" && (
              <div>
                <Label htmlFor="timeRange">{t("timeRange")}</Label>
                <TimeRangeSelect
                  value={
                    formData.config.mainData.params.timeRange || "sinceStart"
                  }
                  options={["sinceStart", "thisWeek", "thisMonth", "thisYear"]}
                  onValueChange={updateTimeRange}
                  translations={t}
                />
              </div>
            )}

            {formData.config.mainData.calculator === "customAverage" && (
              <div>
                <Label htmlFor="customAverageId">{t("customAverageId")}</Label>
                <Input
                  id="customAverageId"
                  value={formData.config.mainData.params.customAverageId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: {
                        ...formData.config,
                        mainData: {
                          ...formData.config.mainData,
                          params: {
                            ...formData.config.mainData.params,
                            customAverageId: e.target.value,
                          } as MainDataParams,
                        },
                      },
                    })
                  }
                  placeholder={t("customAverageIdPlaceholder")}
                />
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">{t("descriptionTemplate")}</Label>
              <Textarea
                id="description"
                value={formData.config.description.template}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    config: {
                      ...formData.config,
                      description: {
                        ...formData.config.description,
                        template: e.target.value,
                      },
                    },
                  })
                }
                placeholder={t("descriptionTemplatePlaceholder")}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("descriptionTemplateHelp")}
              </p>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">{t("availableVariables")}</h3>
              <ul className="text-sm space-y-1">
                <li className="flex justify-between">
                  <code className="bg-secondary rounded px-1">
                    {"{growth}"}
                  </code>
                  <span className="text-muted-foreground">
                    {t("growthVariable")}
                  </span>
                </li>
                <li className="flex justify-between">
                  <code className="bg-secondary rounded px-1">
                    {"{timeRange}"}
                  </code>
                  <span className="text-muted-foreground">
                    {t("timeRangeVariable")}
                  </span>
                </li>
                <li className="flex justify-between">
                  <code className="bg-secondary rounded px-1">
                    {"{subjectName}"}
                  </code>
                  <span className="text-muted-foreground">
                    {t("subjectNameVariable")}
                  </span>
                </li>
                <li className="flex justify-between">
                  <code className="bg-secondary rounded px-1">
                    {"{gradeName}"}
                  </code>
                  <span className="text-muted-foreground">
                    {t("gradeNameVariable")}
                  </span>
                </li>
                <li className="flex justify-between">
                  <code className="bg-secondary rounded px-1">
                    {"{comparisonValue}"}
                  </code>
                  <span className="text-muted-foreground">
                    {t("comparisonValueVariable")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <PlusCircle className="h-4 w-4 mr-2" />
        {t("addCard")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createNewCard")}</DialogTitle>
          </DialogHeader>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 mx-1 rounded-full ${
                    index + 1 <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {t("step")} {step} {t("of")} {totalSteps}:{" "}
              {step === 1
                ? t("basicInfo")
                : step === 2
                ? t("dataConfiguration")
                : t("description")}
            </p>
          </div>

          {renderStepContent()}

          <DialogFooter className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t("cancel")}
              </Button>
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  {t("back")}
                </Button>
              )}
            </div>
            <Button
              onClick={nextStep}
              disabled={isCreatingTemplate || isUpdatingLayout}
            >
              {step < totalSteps ? t("next") : t("create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
