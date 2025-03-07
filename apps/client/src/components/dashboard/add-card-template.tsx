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

interface AddCardTemplateProps {
  page?: "dashboard" | "grade" | "subject";
}

type MainDataType = "grade" | "average" | "impact" | "text" | "custom";

export default function AddCardTemplate({
  page: defaultPage,
}: AddCardTemplateProps) {
  const t = useTranslations("Dashboard.Components.AddCardTemplate");
  const [open, setOpen] = useState(false);
  const { mutate: createTemplate, isPending: isCreatingTemplate } =
    useCreateCardTemplate();
  const { mutate: updateLayout, isPending: isUpdatingLayout } =
    useUpdateCardLayout();
  const { data: currentLayout } = useCardLayout(defaultPage || "dashboard");

  const [formData, setFormData] = useState({
    type: "custom" as const,
    identifier: "",
    config: {
      title: "",
      description: {
        template: "",
        variables: {},
      },
      mainData: {
        type: "average" as MainDataType,
        calculator: "globalAverage",
        params: {},
      },
      icon: "ChartBarIcon",
    },
  });

  const handleSubmit = () => {
    createTemplate(formData, {
      onSuccess: (_data: unknown, _variables: unknown, _context: unknown) => {
        const data = _data as { template: CardTemplate };
        const page = defaultPage || "dashboard";

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
              setOpen(false);
              setFormData({
                type: "custom",
                identifier: "",
                config: {
                  title: "",
                  description: {
                    template: "",
                    variables: {},
                  },
                  mainData: {
                    type: "average" as MainDataType,
                    calculator: "globalAverage",
                    params: {},
                  },
                  icon: "ChartBarIcon",
                },
              });
            },
          }
        );
      },
    });
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
              />
            </div>

            {!defaultPage && (
              <div>
                <Label htmlFor="page">{t("page")}</Label>
                <Select
                  value={defaultPage || "dashboard"}
                  onValueChange={(value: "dashboard" | "grade" | "subject") => {
                    // We don't need to update formData since we're using defaultPage
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">{t("dashboard")}</SelectItem>
                    <SelectItem value="grade">{t("grades")}</SelectItem>
                    <SelectItem value="subject">{t("subject")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

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
              />
            </div>

            <div>
              <Label htmlFor="calculator">{t("calculator")}</Label>
              <Select
                value={formData.config.mainData.calculator}
                onValueChange={(value: string) =>
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
                        type: value,
                        calculator: formData.config.mainData.calculator,
                        params: {},
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isCreatingTemplate || isUpdatingLayout}
            >
              {t("create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
