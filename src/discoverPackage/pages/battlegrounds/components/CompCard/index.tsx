import { Arrow } from '@taroify/icons';
import { Image, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import { BattlegroundsCard, BattlegroundsComp } from '@/models';

import { CoreCards } from '../CoreCards';
import { DifficultyStars } from '../DifficultyStars';
import { TierBadge } from '../TierBadge';

import './index.scss';

interface CompCardProps {
  comp: BattlegroundsComp;
  cardMap: Map<number, BattlegroundsCard>;
}

export const CompCard: React.FC<CompCardProps> = ({ comp, cardMap }) => {
  const representativeCard = cardMap.get(comp.comp_representative_card);

  const handleCardClick = () => {
    Taro.navigateTo({
      url: `/discoverPackage/pages/battlegrounds/detail/index?comp_id=${comp.comp_id}`,
    });
  };

  return (
    <View className='comp-card' onClick={handleCardClick}>
      <View className='comp-card-header'>
        <View className='comp-card-representative'>
          {representativeCard && (
            <Image
              className='comp-card-representative-image'
              src={`https://art.hearthstonejson.com/v1/256x/${representativeCard.id}.webp`}
              mode='aspectFit'
              lazyLoad
            />
          )}
        </View>
        <View className='comp-card-info'>
          <View className='comp-card-name'>
            <TierBadge tier={comp.comp_tier} />
            <Text>{comp.comp_name}</Text>
            <Arrow className='comp-card-arrow' />
          </View>
          <Text className='comp-card-summary'>{comp.comp_summary}</Text>
          <DifficultyStars difficulty={comp.comp_difficulty} />
        </View>
      </View>
      <CoreCards coreCardIds={comp.comp_core_cards} cardMap={cardMap} />
    </View>
  );
};
