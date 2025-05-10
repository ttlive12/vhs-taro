import { useRequest } from "ahooks";
import { View } from "@tarojs/components";
import useModeStore from "@/store/mode";
import { getArchetypes } from "@/api";
import { Loading, NavigationBar } from "@/components";
import { Archetypes } from "@/models";
import { RankBar } from "@/components";
import { useRankBarStore } from "@/store/rankBar";
import { Card } from "./components/Card";
import { Item } from "./components/Item";
import "./index.scss";
import { RankType, useRankTypeStore } from "@/store/rankType";
import { useMemo } from "react";
import { calculateCombinedScore } from "@/utils";

export function RankPage({ data }: { data: Archetypes[] }) {
  return (
    <View className="rank-container">
      <View className="rank-header">
        {data
          .filter((_, index) => index < 2)
          .map((item, index) => (
            <Card data={item} order={index + 1} />
          ))}
      </View>
      <View className="rank-list">
        {data
          .filter((_, index) => index >= 2)
          .map((item, index) => (
            <Item data={item} order={index + 2} />
          ))}
      </View>
    </View>
  );
}

export default function Loader() {
  const mode = useModeStore((state) => state.mode);
  const { currentType } = useRankBarStore((state) => state);
  const { rankType } = useRankTypeStore((state) => state);

  const { data, loading } = useRequest(() => getArchetypes(mode), {
    refreshDeps: [mode],
  });

  const showData = useMemo(() => {
    const currentData = data?.[currentType];
    if (!currentData) return null;

    if (rankType === RankType.COMBINED) {
      // 计算综合得分并按得分排序
      return [...currentData].sort((a, b) => {
        const scoreA = calculateCombinedScore(a, currentType);
        const scoreB = calculateCombinedScore(b, currentType);
        return scoreB - scoreA;
      });
    }

    if (rankType === RankType.WINRATE) {
      return [...currentData].sort((a, b) => b.winrate - a.winrate);
    }

    return currentData;
  }, [data, rankType, currentType]);

  return (
    <View className="rank-page">
      <NavigationBar title="排行榜" showLogo />
      <RankBar />
      {loading ? (
        <Loading style={{ marginTop: 100 }} />
      ) : showData ? (
        <RankPage data={showData} />
      ) : null}
    </View>
  );
}
