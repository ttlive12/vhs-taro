import { FC, useState } from 'react';

import { Image, ScrollView, Text, View } from '@tarojs/components';
import Taro, { nextTick } from '@tarojs/taro';

import { Rank } from '@/constants';
import { useRankBarStore } from '@/store/rankBar';

import './index.scss';

interface RankBarProps {
  className?: string;
  onRankChange?: (data: { currentType: string }) => void;
}

export const RankBar: FC<RankBarProps> = ({ className, onRankChange }) => {
  const { currentType, sortedDataTypes, setCurrentType, setSortedDataTypes } = useRankBarStore();

  // 拖拽状态移到组件内部管理
  const [isDragging, setIsDragging] = useState(false);
  const [dragItemIndex, setDragItemIndex] = useState(-1);

  // 处理选择类型
  const handleSwitch = (type: Rank) => {
    if (isDragging) return;

    setCurrentType(type);
    if (onRankChange) {
      onRankChange({ currentType: type });
    }
  };

  // 长按开始拖拽
  const handleLongPress = (index: number) => {
    setIsDragging(true);
    setDragItemIndex(index);
  };

  // 获取元素位置信息
  const getBoundingClientRect = async (index: number) => {
    return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult>(resolve => {
      Taro.createSelectorQuery()
        .select(`#rank-item-${index}`)
        .boundingClientRect(rect => {
          if (rect) {
            resolve(rect as Taro.NodesRef.BoundingClientRectCallbackResult);
          }
        })
        .exec();
    });
  };

  // 处理拖拽移动
  const handleTouchMove = async e => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const pageX = touch.pageX;

    // 检查当前拖拽项索引是否有效
    if (dragItemIndex < 0 || dragItemIndex >= sortedDataTypes.length) {
      console.error('无效的拖拽索引', dragItemIndex);
      nextTick(() => {
        setIsDragging(false);
        setDragItemIndex(-1);
      });
      return;
    }

    // 获取所有元素的位置信息
    const promises = sortedDataTypes.map((_, index) => getBoundingClientRect(index));
    const rects = await Promise.all(promises);

    // 找到当前触摸位置对应的元素
    let targetIndex = -1;
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      if (rect && pageX >= rect.left && pageX <= rect.right) {
        targetIndex = i;
        break;
      }
    }

    // 如果找到目标元素，并且与当前拖拽元素不同，则交换位置
    if (targetIndex !== -1 && targetIndex !== dragItemIndex) {
      const newDataTypes = [...sortedDataTypes];

      // 再次检查是否有效
      if (!newDataTypes[dragItemIndex]) {
        console.error('拖拽项不存在', dragItemIndex);
        return;
      }

      const dragItem = newDataTypes[dragItemIndex];

      // 删除拖动项并在新位置插入
      newDataTypes.splice(dragItemIndex, 1);
      newDataTypes.splice(targetIndex, 0, dragItem);

      // 检查结果数组长度是否正确
      if (newDataTypes.length !== sortedDataTypes.length) {
        console.error('排序后数组长度异常', newDataTypes.length, sortedDataTypes.length);
        return;
      }

      setSortedDataTypes(newDataTypes);
      setDragItemIndex(targetIndex);
    }
  };

  // 处理拖拽结束
  const handleTouchEnd = () => {
    if (!isDragging) return;

    // 检查索引是否有效
    if (dragItemIndex >= 0 && dragItemIndex < sortedDataTypes.length) {
      // 选中最后拖拽的项
      const draggedItem = sortedDataTypes[dragItemIndex];
      if (draggedItem && draggedItem.id) {
        setCurrentType(draggedItem.id);
        if (onRankChange) {
          onRankChange({ currentType: draggedItem.id });
        }
      }
    } else {
      console.error('结束拖拽时索引无效', dragItemIndex);
    }

    // 重置拖拽状态
    nextTick(() => {
      setIsDragging(false);
      setDragItemIndex(-1);
    });
  };

  const getClassName = (item: any, index: number) => {
    return `type-item ${item.id === currentType ? 'type-item-current' : ''} ${
      dragItemIndex === index ? 'type-item-dragging' : ''
    }`;
  };

  return (
    <ScrollView
      scrollX={!isDragging}
      enhanced
      showScrollbar={false}
      className={`rank-bar-container ${className}`}
    >
      <View className='spacer' />
      {sortedDataTypes.map((item, index) => (
        <View
          key={item.id}
          id={`rank-item-${index}`}
          className={getClassName(item, index)}
          onClick={() => handleSwitch(item.id)}
          onLongPress={() => handleLongPress(index)}
          onTouchMove={isDragging ? handleTouchMove : undefined}
          onTouchEnd={isDragging ? handleTouchEnd : undefined}
          onTouchCancel={isDragging ? handleTouchEnd : undefined}
        >
          <View className='type-item-inner'>
            <Image className='type-item-inner-img' src={item.url} mode='aspectFit' />
            <Text className='type-item-inner-text'>{item.name}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
