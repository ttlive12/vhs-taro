import { Text, View } from '@tarojs/components';

import './index.scss';

interface DifficultyStarsProps {
  difficulty: number;
}

export const DifficultyStars: React.FC<DifficultyStarsProps> = ({ difficulty }) => {
  const maxStars = 3;

  return (
    <View className='difficulty-stars'>
      <Text className='difficulty-label'>难度：</Text>
      <View className='stars'>
        {Array.from({ length: maxStars }, (_, index) => (
          <Text
            key={index}
            className={`star ${index < maxStars + 1 - difficulty ? 'filled' : 'empty'}`}
          >
            ★
          </Text>
        ))}
      </View>
    </View>
  );
};
