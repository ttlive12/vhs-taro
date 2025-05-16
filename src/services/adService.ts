import Taro, { RewardedVideoAd } from '@tarojs/taro';

// 激励广告单例
let rewardedVideoAd: RewardedVideoAd | null = null;

// 广告单元ID
const AD_UNIT_ID = 'adunit-28756f75721e4cf2';

// 存储键名
const COMPLETE_VIEW_KEY = 'ad_complete_view_time';
const INCOMPLETE_VIEW_KEY = 'ad_incomplete_view_time';
const AD_START_TIME_KEY = 'ad_start_time';

// 观看时长阈值（毫秒）
const MIN_VIEW_DURATION = 5000; // 5秒

/**
 * 加载激励广告
 * @returns Promise
 */
export const initRewardedVideoAd = (): Promise<boolean> => {
  return new Promise(resolve => {
    // 如果已经创建过广告实例，则直接返回
    if (rewardedVideoAd) {
      resolve(true);
      return;
    }

    // 创建激励广告实例
    if (Taro.createRewardedVideoAd) {
      rewardedVideoAd = Taro.createRewardedVideoAd({
        adUnitId: AD_UNIT_ID,
      });

      // 监听加载事件
      rewardedVideoAd.onLoad(() => {
        console.log('激励广告加载成功');
        resolve(true);
      });

      // 监听错误事件
      rewardedVideoAd.onError(err => {
        console.log('激励广告加载失败', err);
        resolve(false);
      });
    } else {
      console.log('当前环境不支持激励广告');
      resolve(false);
    }
  });
};

/**
 * 检查是否应该显示广告
 * @returns {boolean} 是否应该显示广告
 */
export const shouldShowAd = (): boolean => {
  // 检查完整观看记录 - 近三天内不再显示
  const completeViewTime = Taro.getStorageSync(COMPLETE_VIEW_KEY);
  if (completeViewTime) {
    const threeDay = 2.5 * 24 * 60 * 60 * 1000; // 三天的毫秒数
    const now = Date.now();
    if (now - completeViewTime < threeDay) {
      return false;
    }
  }

  // 检查未完整观看记录 - 近5分钟内不再显示
  const incompleteViewTime = Taro.getStorageSync(INCOMPLETE_VIEW_KEY);
  if (incompleteViewTime) {
    const fiveMinutes = 5 * 60 * 1000; // 5分钟的毫秒数
    const now = Date.now();
    if (now - incompleteViewTime < fiveMinutes) {
      return false;
    }
  }

  return true;
};

/**
 * 记录广告观看开始时间
 */
const recordAdStart = (): void => {
  Taro.setStorageSync(AD_START_TIME_KEY, Date.now());
};

/**
 * 获取广告观看时长（毫秒）
 * @returns {number} 观看时长，如果没有开始时间记录则返回0
 */
const getAdViewDuration = (): number => {
  const startTime = Taro.getStorageSync(AD_START_TIME_KEY);
  if (!startTime) return 0;

  const duration = Date.now() - startTime;
  // 清除开始时间记录
  Taro.removeStorageSync(AD_START_TIME_KEY);

  return duration;
};

/**
 * 记录广告观看状态
 * @param isComplete 是否完整观看
 * @returns {boolean} 是否观看了足够长的时间（至少5秒）
 */
const recordAdView = (isComplete: boolean): boolean => {
  const now = Date.now();
  const viewDuration = getAdViewDuration();
  const isLongEnough = viewDuration >= MIN_VIEW_DURATION;

  if (isComplete) {
    // 完整观看，记录时间戳
    Taro.setStorageSync(COMPLETE_VIEW_KEY, now);
    // 清除未完整观看记录
    Taro.removeStorageSync(INCOMPLETE_VIEW_KEY);
  } else if (isLongEnough) {
    // 未完整观看但至少看了5秒，记录时间戳
    Taro.setStorageSync(INCOMPLETE_VIEW_KEY, now);
  }

  return isLongEnough;
};

/**
 * 展示激励广告
 * @returns Promise，返回一个包含两个布尔值的对象：{isCompleted, isLongEnough}
 */
export const showRewardedVideoAd = (): Promise<{ isCompleted: boolean; isLongEnough: boolean }> => {
  return new Promise(async resolve => {
    // 如果未初始化，先初始化广告
    if (!rewardedVideoAd) {
      const initResult = await initRewardedVideoAd();
      if (!initResult) {
        resolve({ isCompleted: false, isLongEnough: false });
        return;
      }
    }

    // 记录观看开始时间
    recordAdStart();

    // 展示广告
    rewardedVideoAd!.show();

    // 监听关闭事件
    rewardedVideoAd!.onClose(res => {
      const isCompleted = !!res && res.isEnded;

      // 记录观看状态并获取是否观看足够长
      const isLongEnough = recordAdView(isCompleted);

      // 返回观看结果
      resolve({ isCompleted, isLongEnough });
    });
  });
};

/**
 * 关闭广告实例
 */
export const destroyRewardedVideoAd = (): void => {
  if (rewardedVideoAd) {
    rewardedVideoAd = null;
  }
};

/**
 * 获取上次完整观看广告的时间
 * @returns {number|null} 时间戳或null
 */
export const getLastCompleteViewTime = (): number | null => {
  const time = Taro.getStorageSync(COMPLETE_VIEW_KEY);
  return time || null;
};

/**
 * 获取上次未完整观看广告的时间
 * @returns {number|null} 时间戳或null
 */
export const getLastIncompleteViewTime = (): number | null => {
  const time = Taro.getStorageSync(INCOMPLETE_VIEW_KEY);
  return time || null;
};

/**
 * 清除广告观看记录
 */
export const clearAdViewRecords = (): void => {
  Taro.removeStorageSync(COMPLETE_VIEW_KEY);
  Taro.removeStorageSync(INCOMPLETE_VIEW_KEY);
  Taro.removeStorageSync(AD_START_TIME_KEY);
};
