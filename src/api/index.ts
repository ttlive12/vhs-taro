import { Mode } from "@/constants";
import {
  Archetypes,
  ModeData,
  PlayerData,
  PlayerRequest,
  Ranked,
} from "@/models";
import { QueryDeckResponse, QueryDecks } from "@/models/api";
import { Deck } from "@/models/deck";
import { Opponent } from "@/models/detail";
import { Mulligan } from "@/models/mulligan";

import request from "./axios";

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

/**
 * 分页查询卡组
 * @param query 查询参数
 * @returns 卡组
 */
export const getDecksByPage = async (query: QueryDecks) => {
  const { filters, page, pageSize } = query;
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, value);
    });
  }
  if (page) {
    params.append("page", page.toString());
  }
  if (pageSize) {
    params.append("pageSize", pageSize.toString());
  }
  return await request<QueryDeckResponse>(
    `/decks/queryDecks?${params.toString()}`
  );
};

/**
 * 获取模式数据
 * @returns 模式数据
 */
export const getModeData = async () => {
  return await request<ModeData>(
    "https://webapi.blizzard.cn/hs-rank-api-server/api/v2/game/mode"
  );
};

/**
 * 获取玩家排名数据
 * @returns 玩家排名数据
 */
export const getPlayerRank = async (
  params: PlayerRequest
): Promise<PlayerData> => {
  return await request<PlayerData>(
    "https://webapi.blizzard.cn/hs-rank-api-server/api/game/ranks",
    {
      params,
    }
  );
};
