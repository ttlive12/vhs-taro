import { Mechanics } from '@/constants';

import Level2 from './2.png';
import Level3 from './3.png';
import Level4 from './4.png';
import Level5 from './5.png';
import Level6 from './6.png';
import border from './border.png';

const DEATHRATTLE = 'https://i.imgs.ovh/2025/05/30/U0nyx.png';
const DIVINE_SHIELD = 'https://i.imgs.ovh/2025/05/30/U02gM.png';
const TAUNT = 'https://i.imgs.ovh/2025/05/30/U0J3h.png';
const REBORN = 'https://i.imgs.ovh/2025/05/30/U0Hor.png';

const mechanicsMap = {
  [Mechanics.DEATHRATTLE]: DEATHRATTLE,
  [Mechanics.DIVINE_SHIELD]: DIVINE_SHIELD,
  [Mechanics.TAUNT]: TAUNT,
  [Mechanics.REBORN]: REBORN,
};

export { border, Level2, Level3, Level4, Level5, Level6, mechanicsMap };
