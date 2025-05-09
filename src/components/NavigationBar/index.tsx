import { View, Text, Image } from "@tarojs/components";
import Taro, { getSystemInfoSync } from "@tarojs/taro";
import { FC, useMemo } from "react";
import { logo, back, setting } from "@/assets";

import "./index.scss";
import useModeStore from "@/store/mode";
import { Mode } from "@/constants";

export interface NavigationBarProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  className?: string;
}

export const NavigationBar: FC<NavigationBarProps> = ({
  title = "",
  showBack = false,
  showLogo = true,
  className = "",
}) => {
  // 获取系统信息，适配状态栏高度
  const systemInfo = useMemo(() => {
    try {
      return getSystemInfoSync();
    } catch (e) {
      console.error("获取系统信息失败", e);
      return { statusBarHeight: 20, platform: "ios" };
    }
  }, []);

  // 获取模式
  const mode = useModeStore((state) => state.mode);

  // 返回按钮处理
  const handleBackClick = () => {
    const pages = Taro.getCurrentPages();
    if (pages.length > 1) {
      Taro.navigateBack();
    }
  };

  return (
    <View
      className={`navigation-bar ${className}`}
      style={{
        paddingTop: `${systemInfo.statusBarHeight}px`,
      }}
    >
      <View className="navigation-bar-content">
        <View className="navigation-bar-left">
          {showBack && (
            <Image
              onClick={handleBackClick}
              className="navigation-bar-logo"
              src={back}
              mode="aspectFit"
            />
          )}

          {showLogo && !showBack && (
            <Image
              className="navigation-bar-logo"
              src={logo}
              mode="aspectFit"
            />
          )}
        </View>

        <View className="navigation-bar-center">
          {title && <Text className="navigation-bar-title">{title}</Text>}
        </View>

        <View className="navigation-bar-right">
          <Image
            className="navigation-bar-right-icon"
            src={setting}
            mode="aspectFit"
          />
          <Text className="navigation-bar-right-text">
            {mode === Mode.STANDARD ? "标准模式" : "狂野模式"}
          </Text>
        </View>
      </View>
    </View>
  );
};
