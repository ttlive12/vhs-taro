import { memo, useMemo } from 'react';

import { Image, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import { CardFrame } from '@/components/CardFrame';
import { Class, Rarity } from '@/constants/enums';
import { classImageMap } from '@/constants/map';
import { Deck } from '@/models/deck';
import useDeckStore from '@/store/deck';

import './index.scss';

interface CardProps {
  id: string;
  index: number;
  data: Deck[];
}

export const Card: React.FC<CardProps> = memo(({ id, index, data }) => {
  const setCurrentDeck = useDeckStore(state => state.setCurrentDeck);

  const deck = useMemo(() => data[index], [data, index]);

  // 获取传说卡牌
  const legendaryCards = deck.cards.filter(card => card.rarity === Rarity.LEGENDARY);

  const handleTap = () => {
    setCurrentDeck(deck);
    Taro.eventCenter.trigger('toDeckDetail'); // 触发事件，改变rankType
    Taro.navigateTo({
      url: `/pages/decks/detail/index?deckId=${deck.deckId}`,
    });
  };

  return (
    <View key={id} className={`deck-card ${deck.class}`} onClick={handleTap}>
      <View className='deck-card-header'>
        <View className='deck-card-header-left'>
          <Image
            className='hero-image'
            src={classImageMap[deck.class as Class]}
            mode='aspectFill'
          />
          <Text className='ellipsis deck-name'>{deck.zhName}</Text>
        </View>
      </View>

      <View className='deck-card-body'>
        <View className='stats'>
          <Text className='winrate'>{deck.winrate.toFixed(1)}%</Text>
          <Text className='games'>{deck.games}场</Text>
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
});
