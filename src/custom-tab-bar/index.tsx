import { Icon } from '@taroify/icons';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import { useTabBarStore } from '@/store/tabBar';

import './index.scss';

export interface TabItem {
  index: number;
  text: string;
  pagePath: string;
  iconName: string;
}

export const tabBarList: TabItem[] = [
  {
    index: 0,
    text: '排行榜',
    pagePath: '/pages/rank/index',
    iconName: 'rank',
  },
  {
    index: 1,
    text: '卡组',
    pagePath: '/pages/decks/index',
    iconName: 'deck',
  },
  {
    index: 2,
    text: '发现',
    pagePath: '/pages/discover/index',
    iconName: 'discover',
  },
];

const Index = () => {
  const { currentIndex, setCurrentIndex } = useTabBarStore();

  const switchTab = (item: TabItem) => {
    Taro.switchTab({ url: item?.pagePath });
    setCurrentIndex(item?.index);
  };

  return (
    <View className='tab-capsule'>
      {tabBarList.map(item => {
        const isActive = item.index === currentIndex;
        return (
          <View
            className={`tab-capsule-item ${isActive ? 'tab-capsule-item-active' : ''}`}
            onClick={() => switchTab(item)}
            key={item.index}
          >
            <Icon
              classPrefix='icon'
              name={item.iconName}
              className={`tab-capsule-item-icon ${isActive ? 'tab-capsule-item-icon-active' : ''}`}
              size={22}
            />
            <View
              className={`tab-capsule-item-text ${isActive ? 'tab-capsule-item-text-active' : ''}`}
            >
              {item?.text}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Index;
