import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import useModeStore from "@/store/mode";
import { NavigationBar, RankBar } from "@/components";
import RelatedDecks from "./components/RelatedDecks";
import CardMulligans from "./components/CardMulligans";

import "./index.scss";

export default function Archetypes() {
  const { mode } = useModeStore();
  const { archetype, zhName } = Taro.getCurrentInstance().router?.params || {};

  return (
    <View className="archetypes-page">
      {/* 卡牌预览组件 */}

      {/* 导航栏 */}
      <NavigationBar title={zhName || ""} showBack />

      {/* 滚动区域 */}
      <View className="archetypes-container">
        {/* 分段选择条 */}
        <RankBar />

        {/* 相关卡组 */}
        <RelatedDecks mode={mode} archetype={archetype as string} />

        {/* 卡牌调度 */}
        <CardMulligans
          mode={mode}
          archetype={archetype as string}
        />

        {/* 底部留白 */}
        <View style={{ height: "100rpx" }} />
      </View>
    </View>
  );
}
