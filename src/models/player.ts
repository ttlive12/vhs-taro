export type ModeTypes =
  | "arena"
  | "battlegrounds"
  | "battlegroundsduo"
  | "wild"
  | "standard"
  | "twist"
  | "mercenaries";

export interface ModeData {
  game_modes: {
    mode_name: ModeTypes;
    cn_mode_name: string;
  }[];
  season_map: {
    [key in ModeTypes]: {
      season_id: number;
      season: string;
    }[];
  };
}

export interface PlayerRequest {
  mode_name: ModeTypes;
  season_id: number;
  page: number;
  page_size: 25;
}

export interface PlayerData {
  list: {
    position: number;
    battle_tag: string;
  }[];
  total: number;
}
