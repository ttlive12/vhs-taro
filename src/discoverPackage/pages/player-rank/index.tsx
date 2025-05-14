import React, { useCallback, useRef, useState } from "react";

import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRequest } from "ahooks";

import { getModeData } from "@/api";
import { Loading, NavigationBar } from "@/components";
import { ModeTypes } from "@/models/player";

import { ModeSelector, PlayerList } from "./components";

import "./index.scss";

/**
 * 玩家排行页面
 */
const PlayerRank: React.FC = () => {
  // 模式和赛季相关状态
  const [modeIndex, setModeIndex] = useState(0);
  const [seasonIndex, setSeasonIndex] = useState(0);

  // 获取模式和赛季数据
  const { data: modeData, loading: modeLoading } = useRequest(getModeData);

  // 模式列表
  const modeList = modeData?.game_modes || [];

  // 当前选中的模式
  const currentMode = modeList[modeIndex] || {
    mode_name: "standard" as ModeTypes,
    cn_mode_name: "标准模式",
  };

  // 当前模式下的赛季列表
  const seasonList =
    modeData?.season_map && currentMode
      ? modeData.season_map[currentMode.mode_name] || []
      : [];

  // 当前选中的赛季
  const currentSeason = seasonList[seasonIndex] || { season_id: 0, season: "" };

  // 是否可以开始请求玩家排名数据
  const canFetchRank =
    !modeLoading && seasonList.length > 0 && currentSeason.season_id !== 0;

  // 创建一个ref，存放PlayerList组件的实例
  const playerListRef = useRef<{ loadMore: () => void } | null>(null);

  // 模式变更处理
  const handleModeChange = useCallback((index: number) => {
    setModeIndex(index);
    setSeasonIndex(0); // 重置赛季选择为第一个
  }, []);

  // 赛季变更处理
  const handleSeasonChange = useCallback((index: number) => {
    setSeasonIndex(index);
  }, []);

  // 监听页面触底事件
  Taro.useReachBottom(() => {
    if (playerListRef.current) {
      playerListRef.current.loadMore();
    }
  });

  return (
    <View className='player-rank-page'>
      <NavigationBar title='玩家排名' showBack showSetting={false} />

      {modeLoading ? (
        <Loading />
      ) : (
        <View className='page-content'>
          <View className='container'>
            {/* 选择器组件 */}
            <ModeSelector
              modeList={modeList}
              seasonList={seasonList}
              modeIndex={modeIndex}
              seasonIndex={seasonIndex}
              currentMode={currentMode}
              currentSeason={currentSeason}
              onModeChange={handleModeChange}
              onSeasonChange={handleSeasonChange}
            />

            {/* 玩家排名列表组件 - 包含自己的数据获取逻辑 */}
            <PlayerList
              ref={playerListRef}
              mode={currentMode.mode_name}
              seasonId={currentSeason.season_id}
              isReady={canFetchRank}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default PlayerRank;
