import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Empty } from '@taroify/core';
import { View } from '@tarojs/components';
import { VirtualWaterfall } from '@tarojs/components-advanced';
import { useRequest } from 'ahooks';

import { getDecksByPage } from '@/api';
import { DelayRender, Loading } from '@/components';
import { Rank } from '@/constants';
import { Deck } from '@/models/deck';
import useModeStore from '@/store/mode';
import useSystemInfoStore from '@/store/systemInfo';
import { rpx2px } from '@/utils/pixel';

import { Card } from '../Card';

import './index.scss';

// 根据卡组的传说卡数量估算高度
const estimateItemSize = (data: Deck[], index?: number) => {
  if (index === undefined) return 200;
  if (!data || !data[index]) return 200;

  const deck = data[index];
  const legendaryCount = deck.cards.filter(card => card.rarity === 'LEGENDARY').length;

  return rpx2px(120 + legendaryCount * 50);
};

const Row = memo(({ id, index, data }: { id: string; index: number; data: Deck[] }) => {
  return <Card key={id} data={data[index]} />;
});

interface WaterfallListProps {
  searchTerm?: string;
  rankType: Rank;
}

export function WaterfallList({ searchTerm = '', rankType }: WaterfallListProps) {
  const mode = useModeStore(state => state.mode);
  const { statusBarHeight, safeAreaBottomHeight } = useSystemInfoStore();

  // 获取当前查询的唯一键
  const cacheKey = useMemo(() => `${mode}-${rankType}-${searchTerm}`, [mode, rankType, searchTerm]);

  const [pageCache, setPageCache] = useState<Record<string, number>>({});
  const [dataCache, setDataCache] = useState<Record<string, Deck[]>>({});
  const [hasMore, setHasMore] = useState<boolean>(true);

  const height = useMemo(
    () => `calc(100vh - ${rpx2px(88 + 140)}px - ${statusBarHeight}px)`,
    [statusBarHeight]
  );

  const paddingBottom = useMemo(
    () => (safeAreaBottomHeight || rpx2px(32)) + rpx2px(100 + 40),
    [safeAreaBottomHeight]
  );

  // 获取当前缓存键的页码
  const currentPage = useMemo(() => {
    return pageCache[cacheKey] || 1;
  }, [pageCache, cacheKey]);

  // 当前显示的数据
  const currentData = useMemo(() => {
    return dataCache[cacheKey] || [];
  }, [dataCache, cacheKey]);

  // 获取卡组数据
  const { loading } = useRequest(
    async () => {
      const result = await getDecksByPage({
        filters: {
          mode,
          rank: rankType,
          ...(searchTerm ? { zhName: searchTerm } : {}),
        },
        page: currentPage,
        pageSize: 20,
      });

      return result;
    },
    {
      refreshDeps: [mode, rankType, currentPage, searchTerm],
      ready: !!mode && !!rankType && !!currentPage,
      debounceWait: 500,
      onSuccess: result => {
        if (!result) return;

        const { decks, total } = result;

        // 更新缓存
        setDataCache(prev => {
          const previousData = currentPage === 1 ? [] : prev[cacheKey] || [];
          const newData = [...previousData, ...decks];

          return {
            ...prev,
            [cacheKey]: newData,
          };
        });

        // 判断是否还有更多数据
        setHasMore(currentPage * 20 < total);
      },
    }
  );

  // 初始加载或切换模式/rank时触发请求
  useEffect(() => {
    // 如果没有当前缓存键的数据，重置为第1页
    if (!dataCache[cacheKey]?.length) {
      setPageCache(prev => ({
        ...prev,
        [cacheKey]: 1,
      }));
    }
  }, [cacheKey, dataCache]);

  // 加载更多
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;

    setPageCache(prev => ({
      ...prev,
      [cacheKey]: (prev[cacheKey] || 1) + 1,
    }));
  }, [hasMore, loading, cacheKey]);

  return (
    <>
      {currentData && currentData.length > 0 && (
        <VirtualWaterfall
          id={cacheKey}
          key={cacheKey}
          className='waterfall'
          height={height}
          width='100%'
          item={Row}
          itemData={currentData}
          itemCount={currentData.length}
          itemSize={index => estimateItemSize(currentData, index)}
          onScrollToLower={loadMore}
          column={2}
          overscanDistance={2000}
          placeholderCount={10}
          upperThreshold={200}
          lowerThreshold={200}
          renderBottom={() => (
            <View
              className='waterfall-bottom'
              style={{
                paddingBottom,
              }}
            >
              {loading ? (
                <Loading />
              ) : (
                <DelayRender delay={1000} onClick={loadMore}>
                  {hasMore ? '点击加载更多' : '没有更多数据啦~'}
                </DelayRender>
              )}
            </View>
          )}
        />
      )}

      {currentData && currentData.length === 0 && !loading && (
        <DelayRender delay={500}>
          <Empty className='waterfall-empty'>
            <Empty.Image src='search' />
            <Empty.Description>未找到相关卡组</Empty.Description>
          </Empty>
        </DelayRender>
      )}
    </>
  );
}
