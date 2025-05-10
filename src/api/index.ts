import request from "./axios";
import { Archetypes, Ranked } from "@/models";
import { Mode } from "@/constants";
import { Deck } from "@/models/deck";

/**
 * 获取卡组类型排行
 * @param mode 模式
 * @returns 卡组类型排行
 */
export const getArchetypes = async (mode: Mode) => {
  return await request<Ranked<Archetypes[]>>(
    `/archetypes/getArchetypes?mode=${mode}`
  );
};

/**
 * 根据卡组名获取卡组
 * @param mode 模式
 * @param archetype 卡组类型
 * @returns 卡组
 */
export const getDecks = async (mode: Mode, archetype: string) => {
  return await request<Ranked<Deck[]>>(
    `/decks/getDecks?mode=${mode}&archetype=${archetype}`
  );
};
