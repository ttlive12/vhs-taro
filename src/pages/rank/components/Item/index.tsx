import { useMemo } from 'react';

import { Image, Text, View } from '@tarojs/components';
import Taro, { pxTransform } from '@tarojs/taro';

import { Archetypes } from '@/models';
import { createColorFn } from '@/utils';
import { limitNumber } from '@/utils/number';

import { point } from '@/assets';

import './index.scss';

export function Item({ data, order }: { data: Archetypes; order: number }) {
  const { zhName, class: heroClass, winrate, popularityPercent, climbingSpeed, name } = data;

  const winrateColor = useMemo(() => createColorFn(30)(limitNumber(10)(winrate - 50)), [winrate]);

  const climbingSpeedColor = useMemo(
    () => createColorFn(10)(limitNumber(2)(climbingSpeed)),
    [climbingSpeed]
  );

  const handleClick = () => {
    // 跳转至卡组详情页
    Taro.navigateTo({
      url: `/pages/archetypes/index?archetype=${name}&zhName=${zhName}`,
    });
  };

  return (
    <View className='item' onClick={handleClick}>
      <Text className='item-index'>{order + 1}</Text>
      <Text className={`item-name ${heroClass}`}>{zhName}</Text>
      <View className='item-container'>
        <Text className='item-subtitle'>热度</Text>
        <Text className='item-text'>{popularityPercent}%</Text>
      </View>
      <View className='item-container' style={{ marginLeft: pxTransform(30) }}>
        <Text className='item-subtitle'>上分速度/时</Text>
        <Text className='item-text' style={{ color: climbingSpeedColor }}>
          {climbingSpeed}⭐
        </Text>
      </View>
      <View className='item-container'>
        <Text className='item-subtitle'>胜率</Text>
        <Text className='item-text' style={{ color: winrateColor }}>
          {winrate}%
        </Text>
      </View>
      <Image className='item-img' src={point} />
    </View>
  );
}
