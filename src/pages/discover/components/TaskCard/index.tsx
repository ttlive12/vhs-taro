import { Icon } from '@taroify/icons';
import { Text, View } from '@tarojs/components';
import { ITouchEvent } from '@tarojs/components/types/common';

import { rpx2px } from '@/utils';

import './index.scss';

export type CardType = 'mint' | 'pink' | 'yellow' | 'battlegrounds';

interface TaskCardProps {
  type: CardType;
  icon: string;
  title: string;
  subtitle: string;
  size?: number;
  onClick?: (event: ITouchEvent) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  type,
  icon,
  title,
  subtitle,
  size = 80,
  onClick,
}) => {
  return (
    <View className={`task-card ${type}`} onClick={onClick}>
      <View className='task-icon-container'>
        <Icon
          name={icon}
          classPrefix='icon'
          className='task-icon'
          style={{ fontSize: rpx2px(size) }}
        />
      </View>
      <View className='task-content'>
        <Text className='task-title'>{title}</Text>
        <Text className='task-subtitle'>{subtitle}</Text>
      </View>
    </View>
  );
};
