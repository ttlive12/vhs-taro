import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { View } from "@tarojs/components";
import { VirtualWaterfall } from "@tarojs/components-advanced";
import { useRequest } from "ahooks";

import { getDecksByPage } from "@/api";
import { Loading, NavigationBar, RankBar } from "@/components";
import { Deck } from "@/models/deck";
import useModeStore from "@/store/mode";
import { useRankBarStore } from "@/store/rankBar";
import useSystemInfoStore from "@/store/systemInfo";

import { Card } from "./components/Card";

import "./index.scss";

// 根据卡组的传说卡数量估算高度
const estimateItemSize = (data: Deck[], index?: number) => {
  if (index === undefined) return 200;
  if (!data || !data[index]) return 200;

  const deck = data[index];
  const legendaryCount = deck.cards.filter(
    (card) => card.rarity === "LEGENDARY"
  ).length;
  // 基础高度160 + 每个传说卡牌大约50高度
  return 60 + legendaryCount * 24.67;
};

const Row = memo(
  ({ id, index, data }: { id: string; index: number; data: Deck[] }) => {
    return <Card key={id} data={data[index]} />;
  }
);

export default function Decks() {
  const mode = useModeStore((state) => state.mode);
  const { safeArea, safeAreaBottomHeight } = useSystemInfoStore();
  const { currentType } = useRankBarStore((state) => state);
  const [pageCache, setPageCache] = useState<Record<string, number>>({});
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 缓存不同rank的数据
  const [dataCache, setDataCache] = useState<Record<string, Deck[]>>({});

  // 获取当前rank的页码
  const currentPage = useMemo(() => {
    return pageCache[currentType] || 1;
  }, [pageCache, currentType]);

  // 当前显示的数据
  const currentData = useMemo(() => {
    return dataCache[currentType] || [];
  }, [dataCache, currentType]);

  // 获取卡组数据
  const { loading } = useRequest(
    async () => {
      const result = await getDecksByPage({
        filters: {
          mode,
          rank: currentType,
        },
        page: currentPage,
        pageSize: 20,
      });

      return result;
    },
    {
      refreshDeps: [mode, currentType, currentPage],
      onSuccess: (result) => {
        if (!result) return;

        const { decks, total } = result;

        // 更新缓存
        setDataCache((prev) => {
          const previousData = currentPage === 1 ? [] : prev[currentType] || [];
          const newData = [...previousData, ...decks];

          return {
            ...prev,
            [currentType]: newData,
          };
        });

        // 判断是否还有更多数据
        setHasMore(currentPage * 20 < total);
      },
    }
  );

  // 初始加载或切换rank时触发请求
  useEffect(() => {
    // 如果没有当前rank的缓存数据，重置为第1页，否则保持当前页
    if (!dataCache[currentType]?.length) {
      setPageCache((prev) => ({
        ...prev,
        [currentType]: 1,
      }));
    }
  }, [currentType, dataCache]);

  // 加载更多
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;

    setPageCache((prev) => ({
      ...prev,
      [currentType]: (prev[currentType] || 1) + 1,
    }));
  }, [hasMore, loading, currentType]);

  return (
    <View className='decks-page'>
      <View className='waterfall-wrapper'>
        <NavigationBar title='推荐卡组' showLogo />
        <RankBar />
        {currentData && currentData.length > 0 && (
          <VirtualWaterfall
            id={currentType}
            key={currentType}
            className='waterfall'
            height={`calc(100vh - 44px - 70px - ${safeArea.top}px)`}
            width='100%'
            item={Row}
            itemData={currentData}
            itemCount={currentData.length}
            itemSize={(index) => estimateItemSize(currentData, index)}
            onScrollToLower={loadMore}
            column={2}
            placeholderCount={20}
            renderBottom={() => (
              <View
                className='waterfall-bottom'
                style={{
                  paddingBottom: safeAreaBottomHeight,
                }}
              >
                {loading ? <Loading /> : hasMore ? "" : "已经到底啦~"}
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
