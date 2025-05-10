import { View, Text, Image, ScrollView } from "@tarojs/components";
import { useRequest } from "ahooks";
import Taro from "@tarojs/taro";

import { getDecks } from "@/api";
import { dust } from "@/assets/image";
import { classImageMap, Mode } from "@/constants";
import { useRankBarStore } from "@/store/rankBar";
import { TitleBar } from "@/components";
import { ClusterOutlined } from "@taroify/icons";
import "./index.scss";

interface RelatedDecksProps {
  mode: Mode;
  archetype: string;
}

const RelatedDecks: React.FC<RelatedDecksProps> = ({ mode, archetype }) => {
  const { currentType } = useRankBarStore();

  // 使用useRequest请求数据
  const { data: decksData, loading } = useRequest(
    () => getDecks(mode, archetype),
    {
      refreshDeps: [mode, archetype, currentType],
    }
  );

  // 点击卡组跳转到卡组详情
  const handleJump = (deckData) => {
    Taro.setStorageSync("deckData", deckData);
    Taro.navigateTo({
      url: `/pages/decks/detail?currentType=${currentType}`,
    });
  };

  return (
    <View className="related-decks">
      <TitleBar
        title="相关卡组"
        icon={<ClusterOutlined size={18} />}
        tips="该卡组类型下的推荐构筑，点击后查看卡组的具体构筑和代码等"
      />
      {decksData && decksData?.[currentType]?.length > 0 ? (
        <ScrollView className="decks" scrollX enhanced showScrollbar={false}>
          <View style={{ display: "inline-block", width: "15px" }} />
          {decksData?.[currentType]?.map((item) => (
            <View
              key={item.deckId}
              className={`decks-item ${item.class}`}
              onClick={() => handleJump(item)}
            >
              <View className="decks-item-inner">
                <View className="decks-item-inner-header">
                  <Image
                    className="class-icon"
                    src={classImageMap[item.class]}
                  />
                  <Text className="deck-name">
                    <Text>{item.zhName}</Text>
                    <Text className="games">({item.games}场)</Text>
                  </Text>
                </View>
                <View className="decks-item-inner-stats">
                  <Text className="decks-item-inner-stats-winrate">
                    {item.winrate}
                  </Text>
                  <View className="decks-item-inner-stats-dust">
                    <Image className="dust-icon" src={dust} />
                    <Text>{item.dust}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          <View
            style={{
              display: "inline-block",
              color: "transparent",
              fontSize: "1px",
            }}
          >
            0
          </View>
        </ScrollView>
      ) : (
        <View className="no-data">
          {!loading && (
            <>
              <Text>暂无数据</Text>
              {decksData && Object.values(decksData).flat().length > 0 ? (
                <View className="tip">您可以选择切换分段查看相关数据</View>
              ) : (
                <View className="tip">当前卡组样本量小，以后再来查看吧</View>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default RelatedDecks;
