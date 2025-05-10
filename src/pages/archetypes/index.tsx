import { View, Text } from "@tarojs/components";
import useModeStore from "@/store/mode";
import { getDecks } from "@/api";
import { useRequest } from "ahooks";
import Taro from "@tarojs/taro";

import "./index.scss";
import { NavigationBar } from "@/components";
import { useRankBarStore } from "@/store/rankBar";

export default function Deck() {
  const { mode } = useModeStore();
  const { currentType } = useRankBarStore();
  const { archetype } = Taro.getCurrentInstance().router?.params || {};
  const { data, loading } = useRequest(
    () => getDecks(mode, archetype as string),
    {
      refreshDeps: [mode, archetype],
    }
  );
  return (
    <View className="archetypes-container">
      <NavigationBar title="卡组" showBack />
      <View className="archetypes-list">
        {data?.[currentType]?.map((item) => (
          <View className="archetypes-item" key={item.deckId}>
            <Text>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
