import Taro from "@tarojs/taro";

export const px2rpx = (px: number) => {
  return (px * 750) / Taro.getSystemInfoSync().windowWidth;
};

export const rpx2px = (rpx: number) => {
  return (rpx / 750) * Taro.getSystemInfoSync().windowWidth;
};
