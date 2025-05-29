import { View } from '@tarojs/components';

import { BattlegroundsCard } from '@/discoverPackage/components';
import { BattlegroundsCard as BattlegroundsCardType } from '@/models';

import './index.scss';

interface CoreCardsProps {
  coreCardIds: number[];
  cardMap: Map<number, BattlegroundsCardType>;
}

export const CoreCards: React.FC<CoreCardsProps> = ({ coreCardIds, cardMap }) => {
  if (!coreCardIds || coreCardIds.length === 0) {
    return null;
  }

  return (
    <View className='core-cards'>
      <View className='core-cards-list'>
        {coreCardIds.map(cardId => {
          const card = cardMap.get(cardId);
          if (!card) return null;

          return (
            <View key={cardId} className='core-card'>
              <BattlegroundsCard card={card} size='medium' />
            </View>
          );
        })}
      </View>
    </View>
  );
};
