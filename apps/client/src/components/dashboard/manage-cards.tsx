"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Settings } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  CardTemplate,
  CardLayoutItem,
  useCard,
  useCardLayout,
  useUpdateCardLayout,
} from "@/hooks/use-card-layouts";

import CustomizeCardDialog from "../dialogs/customize-card-dialog";
// (Optional) If you want to allow creating brand-new templates from within ManageCards
// import AddCardTemplate from "./add-card-template";

import { builtInCardConfigs } from "@/components/dashboard/dynamic-data-card";

interface ManageCardsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: "dashboard" | "grade" | "subject";
}

/** Checks if this template is a built-in card (keys in builtInCardConfigs). */
function isBuiltIn(template: CardTemplate) {
  // If using template.id for built-in keys:
  return template.type === "built_in" && !!builtInCardConfigs[template.id];
}

/** Returns a localized title for built-in cards; otherwise uses template.config.title. */
function getLocalizedCardTitle(
  t: any,
  dataCardsT: any,
  template: CardTemplate
) {
  if (isBuiltIn(template)) {
    // builtInCardConfigs[template.id].titleKey => e.g. "generalAverage", "bestGrade", etc.
    const titleKey = builtInCardConfigs[template.id].titleKey;
    // We use dataCardsT because that’s where "Dashboard.Components.DataCards" messages exist
    return dataCardsT(titleKey);
  }

  // Custom card => fallback to the template’s saved title
  const config =
    typeof template.config === "string"
      ? JSON.parse(template.config)
      : template.config;
  return config.title || "";
}

export default function ManageCards({
  open,
  onOpenChange,
  page,
}: ManageCardsProps) {
  const t = useTranslations("Dashboard.Components.ManageCards");
  // A second set of translations for built-in data card titles (like "Best Grade", etc.)
  const dataCardsT = useTranslations("Dashboard.Components.DataCards");

  const { data: templates } = useCard();
  const { data: layout } = useCardLayout(page);
  const { mutate: updateLayout } = useUpdateCardLayout();

  const [activeCards, setActiveCards] = useState<CardLayoutItem[]>([]);
  const [customizeCard, setCustomizeCard] = useState<{
    template: CardTemplate;
    layoutItem: CardLayoutItem;
  } | null>(null);

  // Load the user's current layout
  useEffect(() => {
    if (layout?.cards) {
      try {
        const parsedCards =
          typeof layout.cards === "string"
            ? JSON.parse(layout.cards)
            : layout.cards;
        setActiveCards(parsedCards);
      } catch (e) {
        console.error("Error parsing cards:", e);
        setActiveCards([]);
      }
    } else {
      setActiveCards([]);
    }
  }, [layout?.cards]);

  /** Reorder or move a card after drag. */
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = [...activeCards];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setActiveCards(updatedItems);
    updateLayout({ page, cards: updatedItems });
  };

  /** Enable/disable a card by toggling it in the layout. */
  const toggleCard = (templateId: string) => {
    const isActive = activeCards.some((card) => card.templateId === templateId);

    if (isActive) {
      // Remove it
      const updatedCards = activeCards
        .filter((card) => card.templateId !== templateId)
        .map((card, index) => ({ ...card, position: index }));
      setActiveCards(updatedCards);
      updateLayout({ page, cards: updatedCards });
    } else {
      // Add it
      const newCard: CardLayoutItem = {
        templateId,
        position: activeCards.length,
      };
      const updatedCards = [...activeCards, newCard];
      setActiveCards(updatedCards);
      updateLayout({ page, cards: updatedCards });
    }
  };

  /**
   * Renders a single card row, with drag handle, switch, and customize button.
   */
  const renderCard = (
    template: CardTemplate,
    isActive: boolean,
    index?: number
  ) => {
    const title = getLocalizedCardTitle(t, dataCardsT, template);

    return (
      <Card className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Drag handle only shown for active cards */}
          {isActive && (
            <div className="cursor-grab">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          <Switch
            id={template.id}
            checked={isActive}
            onCheckedChange={() => toggleCard(template.id)}
          />
          <span>{title}</span>
        </div>

        {isActive && index !== undefined && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCustomizeCard({
                template,
                layoutItem: activeCards[index],
              })
            }
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </Card>
    );
  };

  /** When user saves from the CustomizeCardDialog. */
  const handleSave = (updatedLayoutItem: CardLayoutItem) => {
    const updatedCards = activeCards.map((card) =>
      card.templateId === updatedLayoutItem.templateId
        ? updatedLayoutItem
        : card
    );
    setActiveCards(updatedCards);
    updateLayout({ page, cards: updatedCards });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 space-y-6">
            {/* Optional: <AddCardTemplate page={page} /> */}

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="space-y-4">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable
                    droppableId="cards"
                    renderClone={(provided, snapshot, rubric) => {
                      const template = templates?.find(
                        (t) =>
                          t.id === activeCards[rubric.source.index].templateId
                      );
                      if (!template) return null;

                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderCard(template, true, rubric.source.index)}
                        </div>
                      );
                    }}
                  >
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <h3 className="text-sm font-medium mb-2">
                          {t("activeCards")}
                        </h3>
                        {activeCards.length === 0 ? (
                          <Card className="p-6 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">
                              {t("noActiveCards")}
                            </p>
                          </Card>
                        ) : (
                          activeCards.map((card, index) => {
                            const template = templates?.find(
                              (t) => t.id === card.templateId
                            );
                            if (!template) return null;

                            return (
                              <Draggable
                                key={card.templateId}
                                draggableId={card.templateId}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="mb-2"
                                  >
                                    {renderCard(template, true, index)}
                                  </div>
                                )}
                              </Draggable>
                            );
                          })
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {/* AVAILABLE CARDS */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-2">
                    {t("availableCards")}
                  </h3>
                  <div className="space-y-2">
                    {templates?.filter(
                      (template) =>
                        !activeCards.some(
                          (card) => card.templateId === template.id
                        )
                    ).length === 0 ? (
                      <Card className="p-6 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          {t("noAvailableCards")}
                        </p>
                      </Card>
                    ) : (
                      templates
                        ?.filter(
                          (template) =>
                            !activeCards.some(
                              (card) => card.templateId === template.id
                            )
                        )
                        .map((template) => renderCard(template, false))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {customizeCard && (
        <CustomizeCardDialog
          open={!!customizeCard}
          onOpenChange={() => setCustomizeCard(null)}
          template={customizeCard.template}
          layoutItem={customizeCard.layoutItem}
          page={page}
          allCards={activeCards}
          onSave={handleSave}
        />
      )}
    </>
  );
}
