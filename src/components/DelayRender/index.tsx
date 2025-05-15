import { ReactNode, useEffect, useState } from 'react';

import { View } from '@tarojs/components';

import './index.scss';

interface DelayRenderProps {
  children: ReactNode;
  delay?: number; // 延迟时间（毫秒），默认为500ms
  placeholder?: ReactNode; // 延迟期间显示的内容
  className?: string; // 自定义类名
}

export const DelayRender = ({
  children,
  delay = 500,
  placeholder,
  className = '',
}: DelayRenderProps) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <View className={`delay-render ${className}`}>{shouldRender ? children : placeholder}</View>
  );
};
