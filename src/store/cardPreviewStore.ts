import { create } from 'zustand';

interface CardPreviewState {
  cardId: string;
  show: boolean;
  setCardPreview: (cardId: string) => void;
  closeCardPreview: () => void;
}

export const useCardPreviewStore = create<CardPreviewState>(set => ({
  cardId: '',
  show: false,
  setCardPreview: (cardId: string) => set({ cardId, show: true }),
  closeCardPreview: () => set({ show: false }),
}));
