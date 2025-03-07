import { apiClient } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types

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

export interface GetDataCardResponse {
  cards: DataCard[];
}

export interface GetDataCardLayoutResponse {
  layout: DataCardLayout;
}

// Queries - Card

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

export function useUpdateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (card: DataCard) => {
      const res = await apiClient.patch(`cards/${card.id}`, {
        json: card,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (card: Omit<DataCard, 'id' | 'userId' | 'createdAt'>) => {
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

// Queries - Card Layout

export function useCardLayout() {
  return useQuery({
    queryKey: ["cardLayout"],
    queryFn: async () => {
      const res = await apiClient.get(`cards/layouts`);
      const data = await res.json<GetDataCardLayoutResponse>();
      return data.layout;
    },
  });
}

export function useUpdateCardLayout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      cards 
    }: { 
      cards: DataCardLayoutItem[] 
    }) => {
      const res = await apiClient.patch(`cards/layouts`, {
        json: cards ,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardLayout"] });
    },
  });
}