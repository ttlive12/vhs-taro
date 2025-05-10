import { View, Text, Image } from "@tarojs/components";
import "./index.scss";

interface TitleBarProps {
  icon: string;
  title: string;
  children?: React.ReactNode;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  icon,
  title,
  children,
}) => {
  return (
    <View className="title-bar">
      <View className="title-bar-header">
        <Image className="title-bar-icon" src={icon} />
        <Text className="title-bar-title">{title}</Text>
      </View>
      {children && <View className="title-bar-content">{children}</View>}
    </View>
  );
};
