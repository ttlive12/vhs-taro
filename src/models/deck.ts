import { Rarity } from "@/constants/enums";

export interface Card {
  /**
   * 卡牌ID
   */
  id: string;

  /**
   * 卡牌数据库ID
   */
  dbfId: number;

  /**
   * 卡牌名称
   */
  name: string;
  /**
   * 卡牌法力值消耗
   */
  cost: number;

  /**
   * 卡牌稀有度
   */
  rarity: Rarity;

  /**
   * 卡牌数量
   */
  count?: number;
}

export interface Deck {
  // 卡组ID
  deckId: string;

  // 卡组名称
  name: string;

  // 卡组中文名称
  zhName: string;

  // 卡组职业
  class: string;

  // 卡组代码
  deckcode: string;

  // 卡组胜率
  winrate: number;

  // 卡组对局次数
  games: number;

  // 卡组尘
  dust: number;

  // 卡组卡牌
  cards: Card[];
}
