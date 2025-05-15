import { create } from 'zustand';

import { Deck } from '@/models';

interface DeckState {
  currentDeck: Deck | null;
  setCurrentDeck: (deck: Deck) => void;
  clearCurrentDeck: () => void;
}

const useDeckStore = create<DeckState>(set => ({
  currentDeck: null,
  setCurrentDeck: deck => set({ currentDeck: deck }),
  clearCurrentDeck: () => set({ currentDeck: null }),
}));

export default useDeckStore;
