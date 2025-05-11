import { Image,View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import { useTabBarStore } from "@/store/tabBar";

import {
  deck,
  deckActive,
  discover,
  discoverActive,
  rank,
  rankActive,
} from "@/assets";

import "./index.scss";

export interface TabItem {
  index: number;
  text: string;
  pagePath: string;
  iconPath: string;
  selectedIconPath: string;
}

export const tabBarList: TabItem[] = [
  {
    index: 0,
    text: "排行榜",
    pagePath: "/pages/rank/index",
    iconPath: rank,
    selectedIconPath: rankActive,
  },
  {
    index: 1,
    text: "卡组",
    pagePath: "/pages/decks/index",
    iconPath: deck,
    selectedIconPath: deckActive,
  },
  {
    index: 2,
    text: "发现",
    pagePath: "/pages/discover/index",
    iconPath: discover,
    selectedIconPath: discoverActive,
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
      {tabBarList.map((item) => {
        const isActive = item.index === currentIndex;
        return (
          <View
            className={`tab-capsule-item ${
              isActive ? "tab-capsule-item-active" : ""
            }`}
            onClick={() => switchTab(item)}
            key={item.index}
          >
            <Image
              src={isActive ? item?.selectedIconPath : item?.iconPath}
              className={`tab-capsule-item-img ${
                isActive ? "tab-capsule-item-img-active" : ""
              }`}
            />
            <View
              className={`tab-capsule-item-text ${
                isActive ? "tab-capsule-item-text-active" : ""
              }`}
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
