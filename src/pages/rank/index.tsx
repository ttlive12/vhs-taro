import { useMemo } from 'react';

import { View } from '@tarojs/components';
import { pxTransform } from '@tarojs/taro';
import { useRequest } from 'ahooks';

import { getArchetypes } from '@/api';
import { Loading, NavigationBar, RankBar } from '@/components';
import { Archetypes } from '@/models';
import useModeStore from '@/store/mode';
import { useRankBarStore } from '@/store/rankBar';
import { RankType, useRankTypeStore } from '@/store/rankType';
import { calculateCombinedScore } from '@/utils';

import { Card } from './components/Card';
import { Item } from './components/Item';

import './index.scss';

export function RankPage({ data }: { data: Archetypes[] }) {
  return (
    <View className='rank-container'>
      <View className='rank-header'>
        {data
          .filter((_, index) => index < 2)
          .map((item, index) => (
            <Card data={item} order={index + 1} key={item.name} />
          ))}
      </View>
      <View className='rank-list'>
        {data
          .filter((_, index) => index >= 2)
          .map((item, index) => (
            <Item data={item} order={index + 2} key={item.name} />
          ))}
      </View>
    </View>
  );
}

export default function Loader() {
  const mode = useModeStore(state => state.mode);
  const { currentType } = useRankBarStore(state => state);
  const { rankType } = useRankTypeStore(state => state);

  const { data, loading } = useRequest(() => getArchetypes(mode), {
    refreshDeps: [mode],
  });

  const showData = useMemo(() => {
    const currentData = data?.[currentType];
    if (!currentData) return null;

    if (rankType === RankType.COMBINED) {
      // 计算综合得分并按得分排序
      return [...currentData].sort((a, b) => {
        const scoreA = calculateCombinedScore(a, currentType);
        const scoreB = calculateCombinedScore(b, currentType);
        return scoreB - scoreA;
      });
    }

    if (rankType === RankType.WINRATE) {
      return [...currentData].sort((a, b) => b.winrate - a.winrate);
    }

    return currentData;
  }, [data, rankType, currentType]);

  return (
    <View className='rank-page'>
      <NavigationBar title='排行榜' showLogo />
      <RankBar />
      {loading ? (
        <Loading style={{ marginTop: pxTransform(200) }} />
      ) : showData ? (
        <RankPage data={showData} />
      ) : null}
    </View>
  );
}
