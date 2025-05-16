import { FC, useMemo } from 'react';

import { Dialog } from '@taroify/core';
import { Icon, ShareOutlined } from '@taroify/icons';
import { Image, Text, View } from '@tarojs/components';
import Taro, { pxTransform, useLoad, useRouter, useUnload } from '@tarojs/taro';
import { useRequest } from 'ahooks';

import { getDeckDetail } from '@/api';
import { CardFrame, Loading, NavigationBar, RankBar } from '@/components';
import CardPreview from '@/components/CardPreview';
import { classImageMap } from '@/constants';
import {
  destroyRewardedVideoAd,
  initRewardedVideoAd,
  shouldShowAd,
  showRewardedVideoAd,
} from '@/services/adService';
import useDeckStore from '@/store/deck';
import useModeStore from '@/store/mode';
import { useRankBarStore } from '@/store/rankBar';
import useVisitHistoryStore from '@/store/visitHistory';
import { createColorFn } from '@/utils';
import { limitNumber } from '@/utils/number';

import { dust } from '@/assets/image';

import './index.scss';

// 卡牌稀有度权重映射
const rarityWeight = {
  FREE: 0,
  COMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
};

// 触发广告询问的访问次数阈值
const VISIT_THRESHOLD = 10;

const limitNum = limitNumber(20);

const DeckDetail: FC = () => {
  const { currentType } = useRankBarStore();
  const { mode } = useModeStore();
  const { incrementVisit } = useVisitHistoryStore();
  const getWinrateColor = useMemo(() => createColorFn(80), []);
  const router = useRouter();
  const deckId = router.params.deckId;

  const deckData = useDeckStore(state => state.currentDeck);

  // 获取卡组详情数据
  const { data: deckDetails, loading } = useRequest(() => getDeckDetail(mode, deckId!), {
    ready: !!deckId,
  });

  // 显示广告询问对话框
  const showAdDialog = (num: number) => {
    Dialog.open({
      title: '观看奖励广告',
      message: (
        <View>
          <View>您今天已经访问{num}个卡组了，观看一条广告支持一下作者吧～</View>
          <View className='ad-tips'>tips: 完整观看广告可清理近三天弹窗</View>
        </View>
      ),
      confirm: {
        children: '观看',
        style: {
          color: '#213E91',
        },
        onClick: () => {
          showRewardedVideoAd().then(result => {
            if (result.isCompleted) {
              // 完整观看
              Taro.showToast({
                title: '感谢支持，已清理近三天弹窗',
                icon: 'none',
              });
            } else if (result.isLongEnough) {
              // 未完整观看但超过5秒
              Taro.showToast({
                title: '感谢支持～',
                icon: 'none',
              });
            }
            // 未观看足够长时间则不显示提示
          });
        },
      },
      cancel: {
        children: '拒绝',
      },
    });
  };

  // 记录页面访问并处理广告逻辑
  useLoad(async () => {
    // 增加访问计数并获取新计数
    const newCount = incrementVisit();

    // 检查是否应该显示广告
    if (newCount >= VISIT_THRESHOLD && newCount % 5 === 0 && shouldShowAd()) {
      await initRewardedVideoAd();
      showAdDialog(newCount);
    }
  });

  useUnload(() => {
    destroyRewardedVideoAd();
  });

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

  // 处理复制卡组代码
  const handleCopy = () => {
    if (deckData) {
      Taro.setClipboardData({
        data: `###${deckData.zhName}\n${deckData.deckcode}`,
        success: () => {
          Taro.showToast({
            title: '复制成功',
            icon: 'success',
          });
        },
        fail: () => {
          Taro.showToast({
            title: '复制失败',
            icon: 'none',
          });
        },
      });
    }
  };

  // 渲染卡组详情内容
  const renderContent = () => {
    if (loading || !deckData) {
      return <Loading style={{ marginTop: pxTransform(200) }} />;
    }

    return (
      <View className='deck-detail-container'>
        <View className='deck'>
          <View className='deck-cards'>
            {sortedCards.map(item => (
              <CardFrame
                key={item.id}
                cardId={item.id}
                cost={item.cost}
                name={item.name}
                rarity={item.rarity}
                count={item.count}
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
            <Icon classPrefix='icon' name='wave' size={22} style={{ transform: 'scaleY(0.7)' }} />
            <Text>对阵胜率</Text>
            <Icon classPrefix='icon' name='wave' size={22} style={{ transform: 'scaleY(0.7)' }} />
          </View>
          {!deckDetails?.[currentType] || deckDetails[currentType].length <= 1 ? (
            <View className='no-data'>
              <Text>暂无数据</Text>
            </View>
          ) : (
            <View className='details-content'>
              {deckDetails[currentType]
                .filter(item => item.class !== 'total')
                .map(item => (
                  <View key={item.class} className='details-item'>
                    <Image className='class-icon' src={classImageMap[item.class]} />
                    <Text style={{ color: getWinrateColor(limitNum(item.winrate - 50)) }}>
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
      <NavigationBar title='卡组详情' showBack showSetting={false} />
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
