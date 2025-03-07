import { apiClient } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface CardTemplate {
  id: string;
  type: 'built_in' | 'custom';
  identifier: string;
  userId: string;
  config: {
    title: string;
    description: {
      template: string;
      variables: {
        [key: string]: {
          type: 'static' | 'dynamic' | 'timeRange';
          value: string;
          options?: any;
        };
      };
    };
    mainData: {
      type: 'grade' | 'average' | 'impact' | 'text' | 'custom';
      calculator: string;
      params?: any;
    };
    icon: string;
  };
  createdAt: string;
}

export interface CardLayoutItem {
  templateId: string;
  position: number;
  customization?: {
    title?: string;
    description?: {
      template?: string;
      variables?: {
        [key: string]: any;
      };
    };
    mainData?: {
      params?: any;
    };
  };
}

export interface CardLayout {
  id: string;
  userId: string;
  page: 'dashboard' | 'grade' | 'subject';
  cards: CardLayoutItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GetCardTemplatesResponse {
  templates: CardTemplate[];
}

export interface GetCardLayoutResponse {
  layout: CardLayout | null;
}

export function useCardTemplates() {
  return useQuery({
    queryKey: ["cardTemplates"],
    queryFn: async () => {
      const res = await apiClient.get("cards/templates");
      const data = await res.json<GetCardTemplatesResponse>();
      return data.templates;
    },
  });
}

export function useCardLayout(page: 'dashboard' | 'grade' | 'subject') {
  return useQuery({
    queryKey: ["cardLayout", page],
    queryFn: async () => {
      const res = await apiClient.get(`cards/layouts/${page}`);
      const data = await res.json<GetCardLayoutResponse>();
      return data.layout;
    },
  });
}

export function useUpdateCardLayout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      page, 
      cards 
    }: { 
      page: 'dashboard' | 'grade' | 'subject'; 
      cards: CardLayoutItem[] 
    }) => {
      const res = await apiClient.put(`cards/layouts/${page}`, {
        json: { page, cards },
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cardLayout", variables.page] });
    },
  });
}

export function useCreateCardTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (template: Omit<CardTemplate, 'id' | 'userId' | 'createdAt'>) => {
      const res = await apiClient.post("cards/templates", {
        json: template,
      });
      return res.json();
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
      const res = await apiClient.delete(`cards/templates/${templateId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardTemplates"] });
    },
  });
}