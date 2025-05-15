import { Icon } from '@taroify/icons';
import { Image, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import { classImageMap } from '@/constants/map';
import { Archetypes } from '@/models';

import { no1, no2, win } from '@/assets';

import './index.scss';

export function Card({ data, order }: { data: Archetypes; order: number; onClick?: () => void }) {
  const { name, zhName, class: heroClass, winrate, popularityPercent, climbingSpeed } = data;

  const getRankIcon = () => {
    if (order === 1) return no1;
    if (order === 2) return no2;
    return '';
  };

  const rankIcon = getRankIcon();

  // 根据职业类型判断背景色深浅
  const isLightBackground = heroClass === 'priest' || heroClass === 'rogue';

  const handleClick = () => {
    // 跳转至卡组详情页
    Taro.navigateTo({
      url: `/pages/archetypes/index?archetype=${name}&zhName=${zhName}`,
    });
  };

  return (
    <View className={`card-container ${heroClass}`} onClick={handleClick}>
      <View className='card-header'>
        <View className='card-header-left'>
          <Image className='hero-avatar' src={classImageMap[heroClass]} mode='aspectFit' />
          <Text className='hero-name ellipsis'>{zhName}</Text>
          {rankIcon && <Image className='rank-icon' src={rankIcon} mode='aspectFit' />}
        </View>
      </View>

      <View className='card-body'>
        <View className='card-body-left'>
          <View className='stat-item'>
            <Icon
              classPrefix='icon'
              name='hot'
              className={`stat-icon ${isLightBackground ? '' : 'icon-light'}`}
            />
            <View className='stat-details'>
              <Text className='stat-label'>热度</Text>
              <Text className='stat-value'>{popularityPercent.toFixed(1)}%</Text>
            </View>
          </View>

          <View className='stat-item'>
            <Icon
              classPrefix='icon'
              name='up'
              className={`stat-icon ${isLightBackground ? '' : 'icon-light'}`}
            />
            <View className='stat-details'>
              <Text className='stat-label'>上分速度</Text>
              <Text className='stat-value'>{climbingSpeed.toFixed(2)}⭐</Text>
            </View>
          </View>
        </View>

        <View className='card-body-right'>
          <View className='winrate-wrapper'>
            <View className='winrate-label'>
              <Image className='stat-icon' src={win} mode='aspectFit' />
              <Text className='stat-label'>胜率</Text>
            </View>
            <Text className='winrate-value'>{winrate.toFixed(1)}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
