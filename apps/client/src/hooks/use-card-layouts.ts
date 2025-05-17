import { apiClient } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========== Types ==========

export interface CardTemplate {
  id: string;
  type: "built-in" | "custom" | "built_in";
  identifier: string;
  userId: string;
  config: {
    title: string;
    description: {
      template: string;
      variables: Record<string, any>;
    };
    mainData: {
      type: string;
      calculator: string;
      params: Record<string, any>;
    };
    icon: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CardLayout {
  id: string;
  userId: string;
  page: "dashboard" | "grade" | "subject";
  cards: CardLayoutItem[] | string;
  createdAt: string;
  updatedAt: string;
}

export interface CardLayoutItem {
  templateId: string;
  position: number;
  customization?: {
    title?: string;
    icon?: string;
    description?: {
      template?: string;
      variables?: Record<string, any>;
    };
    mainData?: {
      params?: Record<string, any>;
      calculator?: string;
    };
  };
}

// Legacy types - keeping for backwards compatibility
export interface DataCard {
  id: string;
  identifier: string;
  userId: string;
  config: {
    title: string;
    description: {
      formatter: string;
      params?: any;
    };
    mainData: {
      calculator: string;
      params?: any;
    };
    icon: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DataCardLayout {
  id: string;
  userId: string;
  cards: {
    cardId: string;
    position: number;
  }
  createdAt: string;
  updatedAt: string;
}

export interface DataCardLayoutItem {
  cardId: string;
  position: number;
}

// ========== Responses ==========

export interface GetCardTemplatesResponse {
  templates: CardTemplate[];
}

export interface GetCardLayoutResponse {
  layout: CardLayout;
}

export interface GetDataCardResponse {
  cards: DataCard[];
}

export interface GetDataCardLayoutResponse {
  layout: DataCardLayout;
}

// ========== Card Template Queries ==========

export function useCardTemplates() {
  return useQuery({
    queryKey: ["cardTemplates"],
    queryFn: async () => {
      try {
        // Using the legacy cards endpoint instead of templates
        const res = await apiClient.get("cards");
        if (!res.ok) {
          console.warn("Failed to fetch card templates:", res.status);
          return []; // Return empty array as fallback
        }
        const data = await res.json<GetDataCardResponse>();
        
        // Convert DataCard[] to CardTemplate[] for backwards compatibility
        return data.cards.map(card => ({
          id: card.id,
          type: card.id.startsWith("ct_") ? "built-in" : "custom" as const,
          identifier: card.identifier,
          userId: card.userId,
          config: {
            title: card.config.title,
            description: {
              template: card.config.description.formatter || "",
              variables: card.config.description.params || {},
            },
            mainData: {
              type: card.config.mainData.calculator, // Using calculator as type
              calculator: card.config.mainData.calculator,
              params: card.config.mainData.params || {},
            },
            icon: card.config.icon,
          },
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
        }));
      } catch (error) {
        console.error("Error fetching card templates:", error);
        return []; // Return empty array on error
      }
    },
  });
}

export function useCreateCardTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (template: Omit<CardTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      try {
        // Convert CardTemplate to DataCard for API compatibility
        const dataCard: Omit<DataCard, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
          identifier: template.identifier,
          config: {
            title: template.config.title,
            description: {
              formatter: template.config.description.template,
              params: template.config.description.variables,
            },
            mainData: {
              calculator: template.config.mainData.calculator,
              params: template.config.mainData.params,
            },
            icon: template.config.icon,
          },
        };
        
        // Use the legacy card creation endpoint
        const res = await apiClient.post(`cards`, {
          json: dataCard,
        });
        if (!res.ok) {
          throw new Error(`Failed to create card template: ${res.status}`);
        }
        return res.json();
      } catch (error) {
        console.error("Error creating card template:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardTemplates"] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (template: CardTemplate) => {
      try {
        // Note: If no update endpoint exists, this might not work
        const res = await apiClient.patch(`cards/${template.id}`, {
          json: {
            identifier: template.identifier,
            config: {
              title: template.config.title,
              description: {
                formatter: template.config.description.template,
                params: template.config.description.variables,
              },
              mainData: {
                calculator: template.config.mainData.calculator,
                params: template.config.mainData.params,
              },
              icon: template.config.icon,
            },
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to update card: ${res.status}`);
        }
        return res.json();
      } catch (error) {
        console.error("Error updating card:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardTemplates"] });
    },
  });
}

export function useDeleteCardTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (templateId: string) => {
      try {
        const res = await apiClient.delete(`cards/${templateId}`);
        if (!res.ok) {
          throw new Error(`Failed to delete card: ${res.status}`);
        }
        return res.json();
      } catch (error) {
        console.error("Error deleting card:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardTemplates"] });
      queryClient.invalidateQueries({ queryKey: ["cardLayout"] });
    },
  });
}

// ========== Card Layout Queries ==========

export function useCardLayout(page: "dashboard" | "grade" | "subject" = "dashboard") {
  return useQuery({
    queryKey: ["cardLayout", page],
    queryFn: async () => {
      // Always return the default layout for now since the endpoint doesn't exist
      return {
        id: `default_${page}`,
        userId: "",
        page,
        cards: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      /* This would be the implementation once the API is ready
      try {
        const res = await apiClient.get(`cards/layouts/${page}`);
        if (!res.ok) {
          console.warn(`Failed to fetch card layout for ${page}:`, res.status);
          // Return a default layout as fallback
          return {
            id: `default_${page}`,
            userId: "",
            page,
            cards: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        const data = await res.json<GetCardLayoutResponse>();
        return data.layout;
      } catch (error) {
        console.error(`Error fetching card layout for ${page}:`, error);
        // Return a default layout on error
        return {
          id: `default_${page}`,
          userId: "",
          page,
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      */
    },
  });
}

export function useUpdateCardLayout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      cards,
      page = "dashboard"
    }: { 
      cards: CardLayoutItem[],
      page?: "dashboard" | "grade" | "subject"
    }) => {
      // Since the endpoint doesn't exist yet, we'll just mock success
      // Remove this and uncomment the actual implementation once the API is ready
      console.info(`Would update layout for ${page} with ${cards.length} cards.`);
      return { success: true };
      
      /* This would be the implementation once the API is ready
      try {
        const res = await apiClient.patch(`cards/layouts/${page}`, {
          json: { cards },
        });
        if (!res.ok) {
          throw new Error(`Failed to update card layout: ${res.status}`);
        }
        return res.json();
      } catch (error) {
        console.error("Error updating card layout:", error);
        throw error;
      }
      */
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["cardLayout", variables.page || "dashboard"] 
      });
    },
  });
}

// ========== Legacy Card Queries - keeping for backwards compatibility ==========

export function useCard() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await apiClient.get("cards");
      const data = await res.json<GetDataCardResponse>();
      return data.cards;
    },
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (card: Omit<DataCard, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const res = await apiClient.post(`cards`, {
        json: card,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cardId: string) => {
      const res = await apiClient.delete(`cards/${cardId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}