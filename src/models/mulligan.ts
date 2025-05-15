import { Card } from './deck';

export interface Mulligan extends Card {
  /**
   * 携带影响
   */
  mulliganImpact: number;

  /**
   * 抽取影响
   */
  drawnImpact: number;

  /**
   * 保留影响
   */
  keptImpact: number;
}
