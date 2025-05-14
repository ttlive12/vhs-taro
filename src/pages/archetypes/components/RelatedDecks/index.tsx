import { Bars } from "@taroify/icons";
import { Image, ScrollView,Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRequest } from "ahooks";

import { getDecks } from "@/api";
import { Loading,TitleBar } from "@/components";
import { classImageMap,Mode } from "@/constants";
import { Deck } from "@/models";
import useDeckStore from "@/store/deck";
import { useRankBarStore } from "@/store/rankBar";

import { dust } from "@/assets/image";

import "./index.scss";

interface RelatedDecksProps {
  mode: Mode;
  archetype: string;
}

const RelatedDecks: React.FC<RelatedDecksProps> = ({ mode, archetype }) => {
  const { currentType } = useRankBarStore();
  const setCurrentDeck = useDeckStore((state) => state.setCurrentDeck);

  // 使用useRequest请求数据
  const { data: decksData, loading } = useRequest(
    () => getDecks(mode, archetype),
    {
      refreshDeps: [mode, archetype],
    }
  );

  // 点击卡组跳转到卡组详情页
  const handleJump = (deckData: Deck) => {
    setCurrentDeck(deckData);
    Taro.navigateTo({
      url: `/pages/decks/detail/index?deckId=${deckData.deckId}`,
    });
  };

  // 渲染内容区域
  const renderContent = () => {
    if (loading) {
      return <Loading size='small' style={{ margin: "42px 0" }} />;
    }

    if (!decksData?.[currentType]?.length) {
      return (
        <View className='no-data'>
          <Text>暂无数据</Text>
          {decksData && Object.values(decksData).flat().length > 0 ? (
            <View className='tip'>您可以选择切换分段查看相关数据</View>
          ) : (
            <View className='tip'>当前卡组样本量小，以后再来查看吧</View>
          )}
        </View>
      );
    }

    return (
      <ScrollView className='decks' scrollX enhanced showScrollbar={false}>
        <View style={{ display: "inline-block", width: "15px" }} />
        {decksData[currentType].map((item) => (
          <View
            key={item.deckId}
            className={`decks-item ${item.class}`}
            onClick={() => handleJump(item)}
          >
            <View className='decks-item-inner'>
              <View className='decks-item-inner-header'>
                <Image className='class-icon' src={classImageMap[item.class]} />
                <Text className='deck-name'>
                  <Text>{item.zhName}</Text>
                  <Text className='games'>({item.games}场)</Text>
                </Text>
              </View>
              <View className='decks-item-inner-stats'>
                <Text className='decks-item-inner-stats-winrate'>
                  {item.winrate}
                </Text>
                <View className='decks-item-inner-stats-dust'>
                  <Image className='dust-icon' src={dust} />
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
    );
  };

  return (
    <View className='related-decks'>
      <TitleBar
        className='related-decks-title-bar'
        title='相关卡组'
        icon={<Bars size={18} />}
        tips='该卡组类型下的推荐构筑，点击后查看卡组的具体构筑和代码等'
      />
      {renderContent()}
    </View>
  );
};

export default RelatedDecks;
