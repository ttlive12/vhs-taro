import React, { memo, useState } from 'react';

import { Image, Text, View } from '@tarojs/components';
import { VirtualList } from '@tarojs/components-advanced';
import { useRouter } from '@tarojs/taro';
import { useRequest } from 'ahooks';

import { getArenaCardData } from '@/api';
import { CardFrame, Loading, NavigationBar } from '@/components';
import CardPreview from '@/components/CardPreview';
import { Class, Rarity } from '@/constants';
import { classNameMap } from '@/constants/map';
import { createColorFn } from '@/utils';
import { limitNumber } from '@/utils/number';
import { rpx2px } from '@/utils/pixel';

import { sort } from '@/assets/svg';

import './index.scss';

// 排序类型
type SortType = 'includedWinrate' | 'includedPopularity' | 'winrateWhenPlayed';

const getColor = createColorFn(50);
const limitNum = limitNumber(10);

// 列表项高度
const ITEM_SIZE = rpx2px(50);

// 列表项组件
const CardItem = memo(({ id, index, data }: { id: string; index: number; data: any[] }) => {
  const card = data[index];

  return (
    <View className='cards-item' id={id}>
      <View className='cards-item-card' style={{ gridColumn: 1 }}>
        <CardFrame
          cardId={card.id}
          cost={card.cost}
          name={card.name}
          rarity={card.rarity as Rarity}
          triggerCardPreview
        />
      </View>
      <Text
        className='cards-item-text'
        style={{ gridColumn: 2, color: getColor(limitNum(card.includedWinrate - 50)) }}
      >
        {card.includedWinrate.toFixed(1)}%
      </Text>
      <Text
        className='cards-item-text'
        style={{ gridColumn: 3, color: getColor(limitNum(card.includedPopularity - 5)) }}
      >
        {card.includedPopularity.toFixed(1)}%
      </Text>
      <Text
        className='cards-item-text'
        style={{ gridColumn: 4, color: getColor(limitNum(card.winrateWhenPlayed - 50)) }}
      >
        {card.winrateWhenPlayed ? card.winrateWhenPlayed.toFixed(1) + '%' : '-'}
      </Text>
    </View>
  );
});

/**
 * 竞技场职业卡牌详情页面
 */
const ArenaCardsPage: React.FC = () => {
  const router = useRouter();
  const { class: className = '' } = router.params;

  // 排序状态
  const [sortType, setSortType] = useState<SortType>('includedWinrate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 获取卡牌数据
  const { data: cardsData, loading } = useRequest(
    () => getArenaCardData(className.toUpperCase() as Class),
    {
      refreshDeps: [className],
      ready: !!className,
    }
  );

  // 处理排序
  const handleSort = (type: SortType) => {
    if (sortType === type) {
      // 如果是当前排序字段，切换排序顺序
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 如果是新的排序字段，设置默认为降序
      setSortType(type);
      setSortOrder('desc');
    }
  };

  // 获取排序后的数据
  const getSortedData = () => {
    if (!cardsData) return [];

    return [...cardsData].sort((a, b) => {
      const valueA = a[sortType] || 0;
      const valueB = b[sortType] || 0;
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });
  };

  // 排序后的数据
  const sortedData = getSortedData();

  return (
    <View className='arena-cards-page'>
      <NavigationBar
        title={`竞技场-${classNameMap[className as Class]}`}
        showBack
        showSetting={false}
      />
      <CardPreview />

      <View className='cards'>
        <View className='cards-header'>
          <View className='sort-header' style={{ gridColumn: 1 }}>
            <Text>卡牌</Text>
          </View>
          <View
            className='sort-header'
            style={{ gridColumn: 2 }}
            onClick={() => handleSort('includedWinrate')}
          >
            <Text>选取胜率</Text>
            <Image
              className={`sort-icon ${
                sortType === 'includedWinrate' ? (sortOrder === 'asc' ? 'asc' : 'desc') : ''
              }`}
              src={sort}
            />
          </View>
          <View
            className='sort-header'
            style={{ gridColumn: 3 }}
            onClick={() => handleSort('includedPopularity')}
          >
            <Text>选取率</Text>
            <Image
              className={`sort-icon ${
                sortType === 'includedPopularity' ? (sortOrder === 'asc' ? 'asc' : 'desc') : ''
              }`}
              src={sort}
            />
          </View>
          <View
            className='sort-header'
            style={{ gridColumn: 4 }}
            onClick={() => handleSort('winrateWhenPlayed')}
          >
            <Text>打出胜率</Text>
            <Image
              className={`sort-icon ${
                sortType === 'winrateWhenPlayed' ? (sortOrder === 'asc' ? 'asc' : 'desc') : ''
              }`}
              src={sort}
            />
          </View>
        </View>

        {loading ? (
          <View className='loading-container'>
            <Loading style={{ marginTop: '20vh' }} />
          </View>
        ) : (
          <VirtualList
            className='cards-virtual-list'
            height='calc(100vh - 100rpx)'
            width='100%'
            item={CardItem}
            itemData={sortedData}
            itemCount={sortedData.length}
            itemSize={ITEM_SIZE}
            position='relative'
            overscanCount={30}
            placeholderCount={10}
            enhanced
          />
        )}
      </View>
    </View>
  );
};

export default ArenaCardsPage;
