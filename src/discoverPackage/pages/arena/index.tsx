import React from 'react';

import { Image, Text, View } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import { useRequest } from 'ahooks';

import { getArenaClassData } from '@/api';
import { Loading, NavigationBar } from '@/components';
import { Class } from '@/constants';
import { classImageMap, classNameMap } from '@/constants/map';
import { ArenaClass } from '@/models';
import { createColorFn, limitNumber } from '@/utils';

import './index.scss';

const getColor = createColorFn(50);
const limitNum = limitNumber(10);

/**
 * 竞技场职业胜率排行页面
 */
const ArenaPage: React.FC = () => {
  // 获取竞技场职业数据
  const { data: classData, loading, refresh } = useRequest(getArenaClassData);

  // 下拉刷新处理
  usePullDownRefresh(() => {
    refresh();
    Taro.stopPullDownRefresh();
  });

  // 职业点击处理函数，跳转到该职业的竞技场卡牌数据页面
  const handleClassTap = (className: Class) => {
    Taro.navigateTo({
      url: `/discoverPackage/pages/arenaCards/index?class=${className}`,
    });
  };

  // 渲染职业列表项
  const renderClassItem = (item: ArenaClass, index: number) => {
    const className = item.class.toLowerCase() as Class;

    return (
      <View
        key={className}
        className={`rank-item ${className}`}
        onClick={() => handleClassTap(className)}
      >
        <Text className={`rank-item-index ${className}`}>{index + 1}</Text>
        <View className='rank-item-content'>
          <Image className='rank-item-img' src={classImageMap[className]} />
          <Text className='rank-item-name'>{classNameMap[className]}</Text>
        </View>
        <View className='rank-item-stats'>
          <Text className='rank-item-label'>胜率</Text>
          <Text
            className='rank-item-winrate'
            style={{ color: getColor(limitNum(item.winRate - 50)) }}
          >
            {item.winRate.toFixed(1)}%
          </Text>
        </View>
        <View className='rank-item-arrow' />
      </View>
    );
  };

  return (
    <View className='arena-page'>
      <NavigationBar title='竞技场职业排行' showBack showSetting={false} />

      <View className='container'>
        <View className='rank'>
          {loading ? (
            <Loading style={{ marginTop: '20vh' }} />
          ) : (
            <View className='rank-list'>
              {classData?.sort((a, b) => b.winRate - a.winRate).map(renderClassItem)}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ArenaPage;
