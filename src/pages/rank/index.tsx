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

  const { data, loading } = useRequest(() => getArchetypes(mode), {
    refreshDeps: [mode],
  });

  return (
    <View className="rank-page">
      <NavigationBar title="排行榜" showLogo />
      <RankBar />
      {loading ? (
        <Loading style={{ marginTop: 100 }} />
      ) : data ? (
        <RankPage data={data[currentType]} />
      ) : null}
    </View>
  );
}
