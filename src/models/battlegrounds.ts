import { Mechanics } from '@/constants';

export interface BattlegroundsComp {
  comp_id: number;
  comp_core_cards: number[]; // dbfId
  comp_difficulty: number;
  comp_guide_recently_updated: boolean;
  comp_hidden: boolean;
  comp_last_updated: string;
  comp_name: string;
  comp_original_name: string;
  comp_previous_tier: number;
  comp_representative_card: number;
  comp_summary: string;
  comp_tier: number;
  comp_tier_last_updated: string;
  comp_tier_recently_updated: boolean;
}

export interface BattlegroundsCompDetail {
  comp_id: number;
  comp_addon_cards: number[]; // dbfId
  comp_common_enablers: string;
  comp_core_cards: number[]; // dbfId
  comp_difficulty: number;
  comp_guide_admin_link: string | null;
  comp_guide_recently_created: boolean;
  comp_guide_recently_updated: boolean;
  comp_hidden: boolean;
  comp_how_to_play: string;
  comp_last_updated: string;
  comp_name: string;
  comp_original_name: string;
  comp_previous_tier: number;
  comp_recently_updated: boolean;
  comp_representative_card: number; // dbfId
  comp_summary: string;
  comp_tier: number;
  comp_tier_last_updated: string;
  comp_tier_recently_updated: boolean;
}

export interface BattlegroundsCard {
  dbfId: number;
  cost: number;
  id: string;
  name: string;
  type: string;
  attack?: number;
  health?: number;
  techLevel: number;
  mechanics?: Mechanics[];
}
