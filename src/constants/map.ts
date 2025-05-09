import { Class } from "./enums";
import {
  priest,
  hunter,
  mage,
  paladin,
  rogue,
  shaman,
  warlock,
  warrior,
  demonhunter,
  deathknight,
  druid,
} from "@/assets";

export const classNameMap = {
  [Class.DRUID]: "德鲁伊",
  [Class.HUNTER]: "猎人",
  [Class.MAGE]: "法师",
  [Class.PALADIN]: "圣骑士",
  [Class.PRIEST]: "牧师",
  [Class.ROGUE]: "盗贼",
  [Class.SHAMAN]: "萨满祭司",
  [Class.WARLOCK]: "术士",
  [Class.WARRIOR]: "战士",
  [Class.DEMONHUNTER]: "恶魔猎手",
  [Class.DEATHKNIGHT]: "死亡骑士",
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
