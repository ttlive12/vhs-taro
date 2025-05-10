import { View, Text } from "@tarojs/components";
import { QuestionOutlined } from "@taroify/icons";
import { Dialog } from "@taroify/core";

import "./index.scss";

interface TitleBarProps {
  icon?: React.ReactNode;
  title?: string;
  tips?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({ icon, title, tips }) => {
  const handleTips = () => {
    Dialog.open({
      title,
      message: tips,
      cancel: "知道了",
    });
  };
  return (
    <View className="title-bar">
      <View className="title-bar-icon">{icon}</View>
      {title && <Text className="title-bar-title">{title}</Text>}
      {tips && (
        <View className="title-bar-tips" onClick={handleTips}>
          <QuestionOutlined size={13} />
        </View>
      )}
    </View>
  );
};
