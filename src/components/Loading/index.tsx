import React, { CSSProperties } from "react";

import { Text,View } from "@tarojs/components";

import "./index.scss";


interface LoadingProps {
  text?: string;
  color?: string;
  size?: "small" | "medium" | "large";
  className?: string;
  style?: CSSProperties;
  full?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  text = "",
  color = "#ffb033",
  size = "medium",
  className = "",
  full = false,
  style = {},
}) => {
  const sizeMap = {
    small: {
      scale: 0.7,
    },
    medium: {
      scale: 0.9,
    },
    large: {
      scale: 1,
    },
  };

  const currentSize = sizeMap[size];
  const scale = currentSize.scale;

  return (
    <View
      className={`loading-container ${full ? "full" : ""} ${className}`}
      style={{ ...style }}
    >
      <View
        className='loading-animation'
        style={
          {
            width: `${100 * scale}rpx`,
            "--color": color,
            transform: `scale(${scale})`,
          } as any
        }
      />
      {text && (
        <Text
          className='loading-text'
          style={{
            color,
            fontSize: `${
              size === "small" ? 18 : size === "medium" ? 26 : 34
            }rpx`,
          }}
        >
          {text}
        </Text>
      )}
    </View>
  );
};
