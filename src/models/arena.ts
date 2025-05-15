import { Class } from '@/constants';

import { Card } from './deck';

/**
 * 竞技场职业胜率接口
 */
export interface ArenaClass {
  /**
   * 职业名称
   */
  class: Class;

  /**
   * 职业胜率
   */
  winRate: number;

  /**
   * 更新时间
   */
  updatedAt?: Date;
}

/**
 * 竞技场卡牌统计接口
 */
export interface ArenaCard extends Card {
  /**
   * 职业名称
   */
  class: string;

  /**
   * 包含次数
   */
  includedCount: number;

  /**
   * 包含流行度
   */
  includedPopularity: number;

  /**
   * 包含胜率
   */
  includedWinrate: number;

  /**
   * 使用时胜率
   */
  winrateWhenPlayed: number;

  /**
   * 更新时间
   */
  updatedAt?: Date;
}
