export * from "./sleep";
export * from "./color";
import { Rank } from "@/constants/enums";
import { Archetypes } from "@/models";

/**
 * 计算卡组综合得分
 * @param archetype 卡组数据
 * @param rankType 排名段位
 * @returns 综合得分
 */
export const calculateCombinedScore = (
  archetype: Archetypes,
  rankType: string
): number => {
  // 不同段位的权重配置
  const weights = {
    [Rank.TOP_LEGEND]: { winrate: 0.7, popularity: 0.3 },
    [Rank.TOP_5K]: { winrate: 0.8, popularity: 0.2 },
    [Rank.DIAMOND_4TO1]: { winrate: 0.8, popularity: 0.2 },
    [Rank.DIAMOND_TO_LEGEND]: { winrate: 0.9, popularity: 0.1 },
  };

  // 获取当前段位的权重，如果没有找到则使用默认权重
  const weight = weights[rankType] || { winrate: 0.8, popularity: 0.2 };

  // 计算综合得分
  return (
    archetype.winrate * weight.winrate +
    archetype.popularityPercent * weight.popularity
  );
};
