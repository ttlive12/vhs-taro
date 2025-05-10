import React from "react";
import { View, Text } from "@tarojs/components";
import { CSSProperties } from "react";

import "./index.scss";

interface LoadingProps {
  text?: string;
  color?: string;
  size?: "small" | "medium" | "large";
  className?: string;
  style?: CSSProperties;
  center?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  text = "",
  color = "#ff9c00",
  size = "medium",
  className = "",
  center = false,
  style = {},
}) => {
  const sizeMap = {
    small: {
      container: 80,
      dot: 4,
      gap: 3,
    },
    medium: {
      container: 120,
      dot: 6,
      gap: 4,
    },
    large: {
      container: 160,
      dot: 8,
      gap: 5,
    },
  };

  const currentSize = sizeMap[size];

  return (
    <View
      className={`loading-container ${center && "full"} ${className}`}
      style={{ ...style }}
    >
      <View
        className="loading-dots"
        style={{
          height: `${currentSize.container}px`,
        }}
      >
        {[...Array(3)].map((_, index) => (
          <View
            key={index}
            className="loading-dot"
            style={{
              width: `${currentSize.dot}px`,
              height: `${currentSize.dot}px`,
              backgroundColor: color,
              margin: `0 ${currentSize.gap}px`,
              animationDelay: `${index * 0.15}s`,
            }}
          />
        ))}
      </View>
      {text && (
        <Text
          className="loading-text"
          style={{
            color,
            fontSize: `${
              size === "small" ? 16 : size === "medium" ? 20 : 24
            }px`,
          }}
        >
          {text}
        </Text>
      )}
    </View>
  );
};
