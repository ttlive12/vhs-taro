import { View } from "@tarojs/components";

import { NavigationBar, RankBar } from "@/components";

import { WaterfallList } from "./components/WaterfallList";

import "./index.scss";

export default function Decks() {
  return (
    <View className='decks-page'>
      <View className='waterfall-wrapper'>
        <NavigationBar title='推荐卡组' showLogo />
        <RankBar />
        <WaterfallList />
      </View>
    </View>
  );
}
