import type { Class } from "../constants/enums";

/**
 * 对手数据
 */
export interface Opponent {
  /**
   * 对手职业
   */
  class: Class | "total";

  /**
   * 对局次数
   */
  games: number;

  /**
   * 胜率
   */
  winrate: number;
}
