import { useEffect, useMemo, useRef } from 'react';

import { Empty } from '@taroify/core';
import { View } from '@tarojs/components';
import { VirtualWaterfall } from '@tarojs/components-advanced';
import { useRequest, useThrottleFn } from 'ahooks';

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

interface WaterfallListProps {
  searchTerm?: string;
  rankType: Rank;
}

export function WaterfallList({ searchTerm = '', rankType }: WaterfallListProps) {
  const mode = useModeStore(state => state.mode);
  const { statusBarHeight, safeAreaBottomHeight } = useSystemInfoStore();

  const decksRef = useRef<Deck[]>([]);
  const pageRef = useRef<number>(1);
  const hasMoreRef = useRef<boolean>(true);

  // 预计算UI尺寸
  const uiDimensions = useMemo(
    () => ({
      height: `calc(100vh - ${rpx2px(88 + 140)}px - ${statusBarHeight}px)`,
      paddingBottom: (safeAreaBottomHeight || rpx2px(32)) + rpx2px(100 + 40),
    }),
    [statusBarHeight, safeAreaBottomHeight]
  );

  // 获取卡组数据
  const { loading, run: fetchDecks } = useRequest(
    async () => {
      const result = await getDecksByPage({
        filters: {
          mode,
          rank: rankType,
          ...(searchTerm ? { zhName: searchTerm } : {}),
        },
        page: pageRef.current,
        pageSize: 20,
      });
      return result;
    },
    {
      manual: true,
      onSuccess: result => {
        if (!result) return;

        const { decks, total } = result;

        if (pageRef.current === 1) {
          decksRef.current = decks;
        } else {
          decksRef.current = [...decksRef.current, ...decks];
        }

        // 判断是否还有更多数据
        hasMoreRef.current = pageRef.current * 20 < total;
      },
    }
  );

  // 初始加载或者参数变化时重置状态并加载数据
  useEffect(() => {
    pageRef.current = 1;
    decksRef.current = [];
    hasMoreRef.current = true;
    fetchDecks();
  }, [mode, rankType, searchTerm, fetchDecks]);

  const { run: loadMore } = useThrottleFn(
    () => {
      if (!hasMoreRef.current || loading) return;

      pageRef.current += 1;
      fetchDecks();
    },
    { wait: 300, leading: true, trailing: false }
  );

  return (
    <>
      {decksRef.current.length > 0 && (
        <VirtualWaterfall
          className='waterfall'
          height={uiDimensions.height}
          width='100%'
          item={Card}
          itemData={decksRef.current}
          itemCount={decksRef.current.length}
          itemSize={index => estimateItemSize(decksRef.current, index)}
          onScrollToLower={loadMore}
          column={2}
          placeholderCount={40}
          enhanced
          renderBottom={() => (
            <View
              className='waterfall-bottom'
              style={{
                paddingBottom: uiDimensions.paddingBottom,
              }}
            >
              {loading ? (
                <Loading />
              ) : (
                <DelayRender delay={400} onClick={loadMore}>
                  {hasMoreRef.current ? '点击加载更多' : '没有更多数据啦~'}
                </DelayRender>
              )}
            </View>
          )}
        />
      )}

      {decksRef.current.length === 0 && !loading && (
        <Empty className='waterfall-empty'>
          <Empty.Image src='search' />
          <Empty.Description>未找到相关卡组</Empty.Description>
        </Empty>
      )}
    </>
  );
}
