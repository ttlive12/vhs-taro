import { Image, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import { CardFrame } from '@/components/CardFrame';
import { Class, Rarity } from '@/constants/enums';
import { classImageMap } from '@/constants/map';
import { Deck } from '@/models/deck';
import useDeckStore from '@/store/deck';

import './index.scss';

interface CardProps {
  data: Deck;
}

export const Card: React.FC<CardProps> = ({ data }) => {
  const setCurrentDeck = useDeckStore(state => state.setCurrentDeck);

  // 获取传说卡牌
  const legendaryCards = data.cards.filter(card => card.rarity === Rarity.LEGENDARY);

  const handleTap = () => {
    setCurrentDeck(data);
    Taro.navigateTo({
      url: `/pages/decks/detail/index?deckId=${data.deckId}`,
    });
  };

  return (
    <View className={`deck-card ${data.class}`} onClick={handleTap}>
      <View className='deck-card-header'>
        <View className='deck-card-header-left'>
          <Image
            className='hero-image'
            src={classImageMap[data.class as Class]}
            mode='aspectFill'
          />
          <Text className='ellipsis deck-name'>{data.zhName}</Text>
        </View>
      </View>

      <View className='deck-card-body'>
        <View className='stats'>
          <Text className='winrate'>{data.winrate.toFixed(1)}%</Text>
          <Text className='games'>{data.games}场</Text>
        </View>
      </View>

      <View className='legendary-cards'>
        {legendaryCards.map(card => (
          <CardFrame
            key={card.id}
            cardId={card.id}
            cost={card.cost}
            name={card.name}
            rarity={card.rarity}
            triggerCardPreview={false}
          />
        ))}
      </View>
    </View>
  );
};
