import request from "./axios";
import { Archetypes, Ranked } from "@/models";
import { Mode } from "@/constants";
import { Deck } from "@/models/deck";
import { Mulligan } from "@/models/mulligan";
import { Opponent } from "@/models/detail";

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
 * 根据卡组类型获取卡组
 * @param mode 模式
 * @param archetype 卡组类型
 * @returns 卡组
 */
export const getDecks = async (mode: Mode, archetype: string) => {
  return await request<Ranked<Deck[]>>(
    `/decks/getDecks?mode=${mode}&archetype=${archetype}`
  );
};

/**
 * 根据卡组类型获取卡组类型留牌指南
 * @param mode 模式
 * @param archetype 卡组类型
 * @returns 卡组类型留牌指南
 */
export const getArchetypeMulligan = async (mode: Mode, archetype: string) => {
  return await request<Ranked<Mulligan[]>>(
    `/mulligan/getMulligan?mode=${mode}&archetype=${archetype}`
  );
};

/**
 * 获取卡组详情
 * @param mode 模式
 * @param deckId 卡组ID
 * @returns 卡组详情
 */
export const getDeckDetail = async (mode: Mode, deckId: string) => {
  return await request<Ranked<Opponent[]>>(
    `/deckdetails/getDecks?mode=${mode}&deckId=${deckId}`
  );
};
