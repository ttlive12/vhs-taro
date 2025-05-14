import React, { useMemo,useState } from "react";

import { ActionSheet } from "@taroify/core";
import { Text, View } from "@tarojs/components";

import { ModeTypes } from "@/models/player";

interface ModeSelectorProps {
  modeList: Array<{ mode_name: ModeTypes; cn_mode_name: string }>;
  seasonList: Array<{ season_id: number; season: string }>;
  modeIndex: number;
  seasonIndex: number;
  currentMode: { mode_name: ModeTypes; cn_mode_name: string };
  currentSeason: { season_id: number; season: string };
  onModeChange: (index: number) => void;
  onSeasonChange: (index: number) => void;
}

/**
 * 模式和赛季选择器组件
 */
const ModeSelector: React.FC<ModeSelectorProps> = ({
  modeList,
  seasonList,
  modeIndex,
  seasonIndex,
  currentMode,
  currentSeason,
  onModeChange,
  onSeasonChange,
}) => {
  const [modeOpen, setModeOpen] = useState(false);
  const [seasonOpen, setSeasonOpen] = useState(false);

  // 生成模式选择器的选项
  const modeActions = useMemo(
    () =>
      modeList.map((mode, index) => ({
        name: mode.cn_mode_name,
        value: index,
        className: index === modeIndex ? "active-option" : "",
      })),
    [modeList, modeIndex]
  );

  // 生成赛季选择器的选项
  const seasonActions = useMemo(
    () =>
      seasonList.map((season, index) => ({
        name: season.season,
        value: index,
        className: index === seasonIndex ? "active-option" : "",
      })),
    [seasonList, seasonIndex]
  );

  // 打开模式选择
  const openModeSelect = () => {
    setModeOpen(true);
  };

  // 打开赛季选择
  const openSeasonSelect = () => {
    setSeasonOpen(true);
  };

  // 选择模式
  const handleModeSelect = (option) => {
    onModeChange(Number(option.value));
    setModeOpen(false);
  };

  // 选择赛季
  const handleSeasonSelect = (option) => {
    onSeasonChange(Number(option.value));
    setSeasonOpen(false);
  };

  return (
    <View className='selectors'>
      {/* 模式选择器 */}
      <View className='selector' onClick={openModeSelect}>
        <View className='selector-content'>
          <Text className='selector-label'>模式</Text>
          <Text className='selector-value'>{currentMode.cn_mode_name}</Text>
        </View>
      </View>

      {/* 赛季选择器 */}
      <View className='selector' onClick={openSeasonSelect}>
        <View className='selector-content'>
          <Text className='selector-label'>赛季</Text>
          <Text className='selector-value'>{currentSeason.season}</Text>
        </View>
      </View>

      {/* 模式选择弹窗 */}
      <ActionSheet
        open={modeOpen}
        onClose={() => setModeOpen(false)}
        onCancel={() => setModeOpen(false)}
        onSelect={handleModeSelect}
        actions={modeActions}
        cancelText='取消'
      />

      {/* 赛季选择弹窗 */}
      <ActionSheet
        open={seasonOpen}
        onClose={() => setSeasonOpen(false)}
        onCancel={() => setSeasonOpen(false)}
        onSelect={handleSeasonSelect}
        actions={seasonActions}
        cancelText='取消'
      />
    </View>
  );
};

export default ModeSelector;
