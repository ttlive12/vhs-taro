import { FC, useEffect, useMemo,useState } from "react";

import { Icon, ShareOutlined } from "@taroify/icons";
import { Image,Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRequest } from "ahooks";

import { getDeckDetail } from "@/api";
import { CardFrame, Loading, NavigationBar, RankBar } from "@/components";
import CardPreview from "@/components/CardPreview";
import { classImageMap } from "@/constants";
import { Deck } from "@/models";
import useModeStore from "@/store/mode";
import { useRankBarStore } from "@/store/rankBar";
import { createColorFn } from "@/utils";

import { dust } from "@/assets/image";

import "./index.scss";

// 卡牌稀有度权重映射
const rarityWeight = {
  FREE: 0,
  COMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
};

const DeckDetail: FC = () => {
  const { currentType } = useRankBarStore();
  const { mode } = useModeStore();
  const getWinrateColor = useMemo(() => createColorFn(80), []);

  // 从缓存获取卡组数据
  const [deckData, setDeckData] = useState<Deck | null>(null);

  // 获取卡组详情数据
  const { data: deckDetails, loading } = useRequest(
    () => getDeckDetail(mode, deckData!.deckId),
    {
      ready: !!deckData?.deckId,
      refreshDeps: [mode, deckData?.deckId],
    }
  );

  // 对卡牌进行排序：优先按费用从小到大，相同费用按稀有度排序
  const sortedCards = useMemo(() => {
    if (!deckData?.cards) return [];
    
    return [...deckData.cards].sort((a, b) => {
      // 先按费用排序
      if (a.cost !== b.cost) {
        return a.cost - b.cost;
      }
      
      // 费用相同时按稀有度排序
      return (rarityWeight[a.rarity] || 0) - (rarityWeight[b.rarity] || 0);
    });
  }, [deckData?.cards]);

  useEffect(() => {
    // 从缓存获取跳转时传递的卡组数据
    const cachedDeckData = Taro.getStorageSync<Deck>("deckData");
    if (cachedDeckData) {
      setDeckData(cachedDeckData);
    } else {
      Taro.showToast({
        title: "未找到卡组数据",
        icon: "none",
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }
  }, []);

  // 处理复制卡组代码
  const handleCopy = () => {
    if (deckData) {
      Taro.setClipboardData({
        data: `###${deckData.zhName}\n${deckData.deckcode}`,
        success: () => {
          Taro.showToast({
            title: "复制成功",
            icon: "success",
          });
        },
        fail: () => {
          Taro.showToast({
            title: "复制失败",
            icon: "none",
          });
        },
      });
    }
  };

  // 渲染卡组详情内容
  const renderContent = () => {
    if (loading || !deckData) {
      return <Loading style={{ marginTop: 100 }} />;
    }

    return (
      <View className='deck-detail-container'>
        <View className='deck'>
          <View className='deck-cards'>
            {sortedCards.map((item) => (
              <CardFrame
                key={item.id}
                cardId={item.id}
                cost={item.cost}
                name={item.name}
                rarity={item.rarity}
              />
            ))}
          </View>
          <View className='deck-dust'>
            <Image src={dust} className='dust-icon' />
            <Text>{deckData.dust}</Text>
          </View>
        </View>
        <View className='details'>
          <View className='details-title'>
            <Icon
              classPrefix='icon'
              name='wave'
              size={22}
              style={{ transform: "scaleY(0.7)" }}
            />
            <Text>对阵胜率</Text>
            <Icon
              classPrefix='icon'
              name='wave'
              size={22}
              style={{ transform: "scaleY(0.7)" }}
            />
          </View>
          {!deckDetails?.[currentType] ||
          deckDetails[currentType].length <= 1 ? (
            <View className='no-data'>
              <Text>暂无数据</Text>
            </View>
          ) : (
            <View className='details-content'>
              {deckDetails[currentType]
                .filter((item) => item.class !== "total")
                .map((item) => (
                  <View key={item.class} className='details-item'>
                    <Image
                      className='class-icon'
                      src={classImageMap[item.class]}
                    />
                    <Text style={{ color: getWinrateColor(item.winrate - 50) }}>
                      {item.winrate}%
                    </Text>
                    <Text className='games'>({item.games})</Text>
                  </View>
                ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className='deck-detail-page'>
      <CardPreview />
      <NavigationBar title='卡组详情' showBack />
      <RankBar />
      {renderContent()}
      <View className='copy-button' onClick={handleCopy}>
        <ShareOutlined size={22} />
        <Text>复制卡组代码</Text>
      </View>
    </View>
  );
};

export default DeckDetail;
