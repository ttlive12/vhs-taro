import { Image, ITouchEvent, Text, View } from '@tarojs/components';

import { BattlegroundsCard as BattlegroundsCardType } from '@/models';
import { useCardPreviewStore } from '@/store/cardPreviewStore';

import { border, Level2, Level3, Level4, Level5, Level6 } from '../../assets';

import './index.scss';

interface BattlegroundsCardProps {
  card: BattlegroundsCardType;
  size?: 'small' | 'medium' | 'large';
}

export const BattlegroundsCard: React.FC<BattlegroundsCardProps> = ({ card, size = 'medium' }) => {
  const { setCardPreview } = useCardPreviewStore();

  const getTechLevelImage = (techLevel: number) => {
    switch (techLevel) {
      case 2:
        return Level2;
      case 3:
        return Level3;
      case 4:
        return Level4;
      case 5:
        return Level5;
      case 6:
        return Level6;
      default:
        return null;
    }
  };

  const techLevelImage = getTechLevelImage(card.techLevel);

  const handleClick = (e: ITouchEvent) => {
    e.stopPropagation();
    setCardPreview(card.id);
  };

  return (
    <View className={`battlegrounds-card battlegrounds-card--${size}`} onClick={handleClick}>
      <View className='battlegrounds-card__container'>
        {/* 背景边框 */}
        <Image className='battlegrounds-card__border' src={border} mode='aspectFit' />

        {/* 卡牌主图 */}
        <View className='battlegrounds-card__image-container'>
          <Image
            className='battlegrounds-card__image'
            src={`https://art.hearthstonejson.com/v1/256x/${card.id}.webp`}
            mode='aspectFill'
            lazyLoad
          />
        </View>

        {/* 等级图标 */}
        {techLevelImage && (
          <Image className='battlegrounds-card__tech-level' src={techLevelImage} mode='aspectFit' />
        )}

        {/* 攻击力 */}
        <Text className='battlegrounds-card__attack'>{card.attack}</Text>

        {/* 血量 */}
        <Text className='battlegrounds-card__health'>{card.health}</Text>
      </View>
    </View>
  );
};
