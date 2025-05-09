import { useMemo } from "react";

import { View, Text, Image } from "@tarojs/components";
import { Archetypes } from "@/models";
import { point } from "@/assets";
import { createColorFn } from "@/utils";

import "./index.scss";

export function Item({ data, order }: { data: Archetypes; order: number }) {
  const {
    zhName,
    class: heroClass,
    winrate,
    popularityPercent,
    climbingSpeed,
  } = data;

  const winrateColor = useMemo(
    () => createColorFn(30)(winrate - 50),
    [winrate]
  );

  const climbingSpeedColor = useMemo(
    () => createColorFn(10)(climbingSpeed),
    [climbingSpeed]
  );

  return (
    <View className="item">
      <Text className="item-index">{order + 1}</Text>
      <Text className={`item-name ${heroClass}`}>{zhName}</Text>
      <View className="item-container">
        <Text className="item-subtitle">热度</Text>
        <Text className="item-text">{popularityPercent}%</Text>
      </View>
      <View className="item-container" style="margin-left: 15rpx">
        <Text className="item-subtitle">上分速度/时</Text>
        <Text className="item-text" style={{ color: climbingSpeedColor }}>
          {climbingSpeed}⭐
        </Text>
      </View>
      <View className="item-container">
        <Text className="item-subtitle">胜率</Text>
        <Text className="item-text" style={{ color: winrateColor }}>
          {winrate}%
        </Text>
      </View>
      <Image className="item-img" src={point} />
    </View>
  );
}
