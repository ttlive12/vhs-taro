import { useCallback, useMemo } from 'react';

import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRequest } from 'ahooks';

import { getBattlegroundsCardData, getBattlegroundsCompDetail } from '@/api';
import { Loading, NavigationBar } from '@/components';
import CardPreview from '@/components/CardPreview';
import { BattlegroundsCard } from '@/discoverPackage/components';
import { BattlegroundsCard as BattlegroundsCardType } from '@/models';
import { useCardPreviewStore } from '@/store/cardPreviewStore';

import './index.scss';

interface HowToPlayPart {
  type: 'text' | 'card-link';
  content: string;
  dbfId?: number;
  cardId?: string;
}

export default function BattlegroundsDetail() {
  const { setCardPreview } = useCardPreviewStore();
  const { comp_id } = Taro.getCurrentInstance().router?.params || {};

  const { data: compDetail, loading: compLoading } = useRequest(
    () => getBattlegroundsCompDetail(Number(comp_id)),
    {
      ready: !!comp_id,
    }
  );

  const { data: cards, loading: cardsLoading } = useRequest(getBattlegroundsCardData);

  // 创建卡牌映射
  const cardMap = useMemo(() => {
    if (!cards) return new Map<number, BattlegroundsCardType>();
    return new Map(cards.map(card => [card.dbfId, card]));
  }, [cards]);

  // 创建dbfId到id的映射
  const dbfIdToIdMap = useMemo(() => {
    if (!cards) return new Map<number, string>();
    return new Map(cards.map(card => [card.dbfId, card.id]));
  }, [cards]);

  // 解析攻略文本中的卡牌链接
  const parseHowToPlay = useCallback(
    (text: string): HowToPlayPart[] => {
      if (!text) return [];

      const regex = /\[+\s*([^|\[\]]+?)\|{2,3}(\d+)\s*\]+/gu;

      const parts: HowToPlayPart[] = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        // 添加链接前的文本
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: text.slice(lastIndex, match.index),
          });
        }

        // 添加卡牌链接
        const [, cardName, dbfId] = match;
        const cardId = dbfIdToIdMap.get(Number(dbfId));

        parts.push({
          type: 'card-link',
          content: cardName,
          dbfId: Number(dbfId),
          cardId,
        });

        lastIndex = regex.lastIndex;
      }

      // 添加剩余文本
      if (lastIndex < text.length) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex),
        });
      }

      return parts;
    },
    [dbfIdToIdMap]
  );

  const howToPlayParts = useMemo(() => {
    return compDetail ? parseHowToPlay(compDetail.comp_how_to_play) : [];
  }, [compDetail, parseHowToPlay]);

  const handleCardLinkClick = (cardId?: string) => {
    if (cardId) {
      setCardPreview(cardId);
    }
  };

  const loading = compLoading || cardsLoading;

  if (loading) {
    return <Loading />;
  }

  if (!compDetail) {
    return (
      <View className='battlegrounds-detail-page'>
        <NavigationBar title='流派详情' showBack />
        <View className='error-message'>流派不存在</View>
      </View>
    );
  }

  return (
    <View className='battlegrounds-detail-page'>
      <NavigationBar title={compDetail.comp_name} showBack showSetting={false} />
      <View className='detail-content'>
        {/* 核心卡牌部分 */}
        <View className='section'>
          <Text className='section-title'>核心卡牌</Text>
          <View className='cards-grid'>
            {compDetail.comp_core_cards.map(cardId => {
              const card = cardMap.get(cardId);
              if (!card) return null;
              return (
                <View key={cardId} className='card-item'>
                  <BattlegroundsCard card={card} size='large' />
                </View>
              );
            })}
          </View>
        </View>

        {/* 补充卡牌部分 */}
        {compDetail.comp_addon_cards && compDetail.comp_addon_cards.length > 0 && (
          <View className='section'>
            <Text className='section-title'>补充卡牌</Text>
            <View className='cards-grid'>
              {compDetail.comp_addon_cards.map(cardId => {
                const card = cardMap.get(cardId);
                if (!card) return null;
                return (
                  <View key={cardId} className='card-item'>
                    <BattlegroundsCard card={card} size='medium' />
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* 玩法指南部分 */}
        <View className='section'>
          <Text className='section-title'>玩法指南</Text>
          <View className='how-to-play'>
            {howToPlayParts.map((part, index) => {
              if (part.type === 'text') {
                return (
                  <Text key={index} className='how-to-play-text'>
                    {part.content}
                  </Text>
                );
              } else if (part.type === 'card-link') {
                return (
                  <Text
                    key={index}
                    className='card-link'
                    onClick={() => handleCardLinkClick(part.cardId)}
                  >
                    {part.content}
                  </Text>
                );
              }
              return null;
            })}
          </View>
        </View>
      </View>

      <CardPreview mode='bgs' />
    </View>
  );
}
