import { useMemo } from 'react';

import { View } from '@tarojs/components';
import { useRequest } from 'ahooks';

import { getBattlegroundsCardData, getBattlegroundsComp } from '@/api';
import { Loading, NavigationBar } from '@/components';
import CardPreview from '@/components/CardPreview';
import { BattlegroundsCard } from '@/models';

import { CompCard } from './components/CompCard';

import './index.scss';

export default function Battlegrounds() {
  const { data: comps, loading: compsLoading } = useRequest(getBattlegroundsComp);
  const { data: cards, loading: cardsLoading } = useRequest(getBattlegroundsCardData);

  // 创建卡牌映射，通过dbfId查找卡牌信息
  const cardMap = useMemo(() => {
    if (!cards) return new Map<number, BattlegroundsCard>();
    return new Map(cards.map(card => [card.dbfId, card]));
  }, [cards]);

  // 按照comp_tier排序流派
  const sortedComps = useMemo(() => {
    if (!comps) return [];
    return [...comps].sort((a, b) => a.comp_tier - b.comp_tier);
  }, [comps]);

  const loading = compsLoading || cardsLoading;

  if (loading) {
    return <Loading />;
  }

  return (
    <View className='battlegrounds-page'>
      <NavigationBar title='酒馆战棋流派' showBack showSetting={false} />
      <View className='comp-list'>
        {sortedComps.map(comp => (
          <CompCard key={comp.comp_id} comp={comp} cardMap={cardMap} />
        ))}
      </View>
      <CardPreview mode='bgs' />
    </View>
  );
}
