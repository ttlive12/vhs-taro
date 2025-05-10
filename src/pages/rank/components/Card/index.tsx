import { View, Text, Image } from "@tarojs/components";
import { Archetypes } from "@/models";
import { classImageMap } from "@/constants/map";
import { hot, hotWhite, up, upWhite, win } from "@/assets/svg";
import { no1, no2 } from "@/assets/image";

import "./index.scss";
import Taro from "@tarojs/taro";

export function Card({
  data,
  order,
}: {
  data: Archetypes;
  order: number;
  onClick?: () => void;
}) {
  const {
    name,
    zhName,
    class: heroClass,
    winrate,
    popularityPercent,
    climbingSpeed,
  } = data;

  const getRankIcon = () => {
    if (order === 1) return no1;
    if (order === 2) return no2;
    return "";
  };

  const rankIcon = getRankIcon();

  // 根据职业类型选择不同的图标颜色
  const isLightBackground = heroClass === "priest" || heroClass === "rogue";
  const hotIcon = isLightBackground ? hot : hotWhite;
  const upIcon = isLightBackground ? up : upWhite;

  const handleClick = () => {
    // 跳转至卡组详情页
    Taro.navigateTo({
      url: `/pages/archetypes/index?archetype=${name}&zhName=${zhName}`,
    });
  };

  return (
    <View className={`card-container ${heroClass}`} onClick={handleClick}>
      <View className="card-header">
        <View className="card-header-left">
          <Image
            className="hero-avatar"
            src={classImageMap[heroClass]}
            mode="aspectFit"
          />
          <Text className="hero-name">{zhName}</Text>
        </View>
        {rankIcon && (
          <Image className="rank-icon" src={rankIcon} mode="aspectFit" />
        )}
      </View>

      <View className="card-body">
        <View className="card-body-left">
          <View className="stat-item">
            <Image className="stat-icon" src={hotIcon} mode="aspectFit" />
            <View className="stat-details">
              <Text className="stat-label">热度</Text>
              <Text className="stat-value">
                {popularityPercent.toFixed(1)}%
              </Text>
            </View>
          </View>

          <View className="stat-item">
            <Image className="stat-icon" src={upIcon} mode="aspectFit" />
            <View className="stat-details">
              <Text className="stat-label">上分速度</Text>
              <Text className="stat-value">{climbingSpeed.toFixed(2)}⭐</Text>
            </View>
          </View>
        </View>

        <View className="card-body-right">
          <View className="winrate-wrapper">
            <View className="winrate-label">
              <Image className="stat-icon" src={win} mode="aspectFit" />
              <Text className="stat-label">胜率</Text>
            </View>
            <Text className="winrate-value">{winrate.toFixed(1)}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
