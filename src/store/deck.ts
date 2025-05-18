import { create } from 'zustand';

import { Rank } from '@/constants/enums';
import { Deck } from '@/models';

interface DeckState {
  currentDeck: Deck | null;
  currentRankType: Rank | null;
  setCurrentDeck: (deck: Deck) => void;
  setCurrentRankType: (rankType: Rank) => void;
  clearCurrentDeck: () => void;
}

const useDeckStore = create<DeckState>(set => ({
  currentDeck: null,
  currentRankType: null,
  setCurrentDeck: deck => set({ currentDeck: deck }),
  setCurrentRankType: rankType => set({ currentRankType: rankType }),
  clearCurrentDeck: () => set({ currentDeck: null }),
}));

export default useDeckStore;
