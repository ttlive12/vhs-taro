import { View, Text, Image } from "@tarojs/components";
import { Archetypes } from "@/models";
import { classImageMap } from "@/constants/map";
import { hot, up } from "@/assets";
import { no1, no2 } from "@/assets/png";

import "./index.scss";

export function Card({ data, order }: { data: Archetypes; order: number }) {
  const {
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

  return (
    <View className={`card-container ${heroClass}`}>
      {rankIcon && (
        <Image className="rank-icon" src={rankIcon} mode="aspectFit" />
      )}

      <View className="card-header">
        <View className="hero-info">
          <Image
            className="hero-avatar"
            src={classImageMap[heroClass]}
            mode="aspectFit"
          />
          <Text className="hero-name">{zhName}</Text>
        </View>
      </View>

      <View className="card-content">
        <View className="left-stats">
          <View className="stat-item">
            <View className="stat-label">
              <Image className="stat-icon" src={hot} mode="aspectFit" />
              <Text className="label-text">热度</Text>
            </View>
            <Text className="stat-value">
              {(popularityPercent).toFixed(1)}%
            </Text>
          </View>

          <View className="stat-item">
            <View className="stat-label">
              <Image className="stat-icon" src={up} mode="aspectFit" />
              <Text className="label-text">上分速度</Text>
            </View>
            <Text className="stat-value">{climbingSpeed.toFixed(2)}<Text className="star">★</Text></Text>
          </View>
        </View>

        <View className="right-stats">
          <View className="stat-item winrate">
            <View className="stat-label">
              <Text className="label-text">胜率</Text>
            </View>
            <Text className="stat-value">{(winrate).toFixed(1)}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
