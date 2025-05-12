import { FC, useState } from "react";

import { ArrowLeft } from "@taroify/icons";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import { Mode } from "@/constants";
import useModeStore from "@/store/mode";
import useSystemInfoStore from "@/store/systemInfo";

import { logo, setting } from "@/assets";

import SettingPopup from "../SettingPopup";

import "./index.scss";

export interface NavigationBarProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  className?: string;
  showSetting?: boolean;
}

export const NavigationBar: FC<NavigationBarProps> = ({
  title = "",
  showBack = false,
  showLogo = true,
  className = "",
  showSetting = true,
}) => {
  // 获取系统信息，适配状态栏高度
  const { safeArea } = useSystemInfoStore();

  // 获取模式
  const mode = useModeStore((state) => state.mode);

  // 设置弹窗状态
  const [showSettingPopup, setShowSettingPopup] = useState(false);

  // 返回按钮处理
  const handleBackClick = () => {
    const pages = Taro.getCurrentPages();
    if (pages.length > 1) {
      Taro.navigateBack();
    }
  };

  // 打开设置弹窗
  const handleOpenSetting = () => {
    setShowSettingPopup(true);
  };

  // 关闭设置弹窗
  const handleCloseSetting = () => {
    setShowSettingPopup(false);
  };

  return (
    <>
      <View
        className={`navigation-bar ${className}`}
        style={{
          paddingTop: `${safeArea.top}px`,
        }}
      >
        <View className='navigation-bar-content'>
          <View className='navigation-bar-left'>
            {showBack && <ArrowLeft onClick={handleBackClick} size={20} />}

            {showLogo && !showBack && (
              <Image
                className='navigation-bar-logo'
                src={logo}
                mode='aspectFit'
              />
            )}
          </View>

          <View className='navigation-bar-center'>
            {title && <Text className='navigation-bar-title'>{title}</Text>}
          </View>

          {showSetting && (
            <View className='navigation-bar-right' onClick={handleOpenSetting}>
              <Image
                className='navigation-bar-right-icon'
                src={setting}
                mode='aspectFit'
              />
              <Text className='navigation-bar-right-text'>
                {mode === Mode.STANDARD ? "标准模式" : "狂野模式"}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 设置弹窗 */}
      <SettingPopup visible={showSettingPopup} onClose={handleCloseSetting} />
    </>
  );
};
