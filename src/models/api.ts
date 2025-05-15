import { Class, Mode, Rank } from '@/constants/enums';

import { Deck } from './deck';

export interface QueryDecks {
  filters?: Filters;
  page?: number;
  pageSize?: number;
}

export interface Filters {
  mode?: Mode;
  class?: Class;
  zhName?: string;
  rank?: Rank;
}

export interface QueryDeckResponse {
  decks: Deck[];
  total: number;
}
