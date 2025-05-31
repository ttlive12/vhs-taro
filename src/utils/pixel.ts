import Taro from '@tarojs/taro';

const systemInfo = Taro.getSystemInfoSync();

export const px2rpx = (px: number) => {
  return (px * 750) / systemInfo.windowWidth;
};

export const rpx2px = (rpx: number) => {
  return (rpx / 750) * systemInfo.windowWidth;
};
