import {
  deathknight,
  demonhunter,
  druid,
  hunter,
  mage,
  paladin,
  priest,
  rogue,
  shaman,
  warlock,
  warrior,
} from "@/assets";

import { Class } from "./enums";

export const classNameMap = {
  [Class.DRUID]: "德鲁伊",
  [Class.HUNTER]: "猎人",
  [Class.MAGE]: "法师",
  [Class.PALADIN]: "圣骑士",
  [Class.PRIEST]: "牧师",
  [Class.ROGUE]: "潜行者",
  [Class.SHAMAN]: "萨满",
  [Class.WARLOCK]: "术士",
  [Class.WARRIOR]: "战士",
  [Class.DEMONHUNTER]: "DH",
  [Class.DEATHKNIGHT]: "DK",
  [Class.NEUTRAL]: "中立",
  [Class.WHIZBANG]: "威兹班",
};

export const classImageMap = {
  [Class.DRUID]: druid,
  [Class.HUNTER]: hunter,
  [Class.MAGE]: mage,
  [Class.PALADIN]: paladin,
  [Class.PRIEST]: priest,
  [Class.ROGUE]: rogue,
  [Class.SHAMAN]: shaman,
  [Class.WARLOCK]: warlock,
  [Class.WARRIOR]: warrior,
  [Class.DEMONHUNTER]: demonhunter,
  [Class.DEATHKNIGHT]: deathknight,
};

export const classColorMap = {
  [Class.DRUID]: "#ff7d0a",
  [Class.HUNTER]: "#abd473",
  [Class.MAGE]: "#69ccf0",
  [Class.PALADIN]: "#f58cba",
  [Class.PRIEST]: "#ffffff",
  [Class.ROGUE]: "#fff569",
  [Class.SHAMAN]: "#0070de",
  [Class.WARLOCK]: "#9482c9",
  [Class.WARRIOR]: "#c79c6e",
  [Class.DEMONHUNTER]: "#a330c9",
  [Class.DEATHKNIGHT]: "#c41f3b",
  [Class.UNKNOWN]: "#000000",
};
