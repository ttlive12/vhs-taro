import { View } from "@tarojs/components";
import { useRequest } from "ahooks";
import useModeStore from "@/store/mode";
import { getArchetypes } from "@/api";
import { Loading, NavigationBar } from "@/components";

import "./index.scss";
import { Archetypes, Ranked } from "@/models";
import { Card } from "./components/Card";
import { Rank } from "@/constants";
import { RankBar } from "@/components";
export function RankPage({ data }: { data: Ranked<Archetypes[]> }) {
  return (
    <View className="rank-container">
      <View className="rank-header">
        <Card data={data[Rank.TOP_LEGEND][0]} order={1} />
        <Card data={data[Rank.TOP_LEGEND][1]} order={2} />
      </View>
    </View>
  );
}

export default function Loader() {
  const mode = useModeStore((state) => state.mode);

  const { data, loading } = useRequest(() => getArchetypes(mode), {
    refreshDeps: [mode],
    onSuccess: (res) => {
      console.log(res);
    },
  });

  return (
    <View className="rank-page">
      <NavigationBar title="排行榜" showLogo />
      <RankBar />
      {loading ? <Loading /> : data ? <RankPage data={data} /> : null}
    </View>
  );
}
