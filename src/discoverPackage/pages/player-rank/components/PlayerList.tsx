import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { Text, View } from '@tarojs/components';
import { useRequest } from 'ahooks';

import { getPlayerRank } from '@/api';
import { Loading } from '@/components';
import { ModeTypes, PlayerRequest } from '@/models/player';

interface PlayerRankItem {
  position: number;
  battle_tag: string;
}

interface PlayerListProps {
  mode: ModeTypes;
  seasonId: number;
  isReady: boolean; // 用于控制是否可以开始请求数据
}

// 定义暴露给父组件的方法
export interface PlayerListRef {
  loadMore: () => void;
}

/**
 * 玩家排行榜列表组件
 * 负责加载和显示玩家排名数据，以及处理分页逻辑
 */
const PlayerList = forwardRef<PlayerListRef, PlayerListProps>((props, ref) => {
  const { mode, seasonId, isReady } = props;

  // 分页和数据状态
  const [pageNum, setPageNum] = useState(1);
  const [playerList, setPlayerList] = useState<PlayerRankItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // 当模式或赛季变化时重置分页和数据
  useEffect(() => {
    setPageNum(1);
    setPlayerList([]);
    setHasMore(true);
  }, [mode, seasonId]);

  // 获取玩家排名数据
  const { loading } = useRequest(
    async () => {
      // 如果不可请求，则直接返回
      if (!isReady) return;

      const isLoadMore = pageNum > 1;

      const params: PlayerRequest = {
        mode_name: mode,
        season_id: seasonId,
        page: pageNum,
        page_size: 25,
      };

      const { list, total } = await getPlayerRank(params);

      // 更新数据
      if (isLoadMore) {
        setPlayerList(prev => [...prev, ...list]);
      } else {
        setPlayerList(list);
      }

      // 更新是否还有更多数据
      setHasMore(
        list.length > 0 && (isLoadMore ? playerList.length + list.length : list.length) < total
      );

      return { list, total };
    },
    {
      ready: isReady,
      refreshDeps: [mode, seasonId, pageNum],
    }
  );

  // 加载更多数据
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPageNum(prev => prev + 1);
    }
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    loadMore: handleLoadMore,
  }));

  return (
    <View className='rank-list'>
      <View className='rank-header'>
        <Text className='rank-header-item rank-position'>排名</Text>
        <Text className='rank-header-item rank-name'>玩家</Text>
      </View>

      <View className='rank-items'>
        {playerList.map(item => (
          <View key={item.position} className='rank-item'>
            <View className='rank-item-position'>
              <Text className='rank-item-position-text'>{item.position}</Text>
            </View>
            <Text className='rank-item-name'>{item.battle_tag}</Text>
          </View>
        ))}
      </View>

      {/* 加载更多 */}
      <View className='load-more'>
        {loading ? (
          <Loading />
        ) : hasMore ? (
          <Text onClick={handleLoadMore}>点击加载更多</Text>
        ) : playerList.length > 0 ? (
          <Text>没有更多数据啦~</Text>
        ) : (
          <Text>暂无数据</Text>
        )}
      </View>
    </View>
  );
});

PlayerList.displayName = 'PlayerList';
export default PlayerList;
