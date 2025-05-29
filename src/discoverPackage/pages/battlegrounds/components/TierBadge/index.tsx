import { Text, View } from '@tarojs/components';

import './index.scss';

interface TierBadgeProps {
  tier: number;
}

export const TierBadge: React.FC<TierBadgeProps> = ({ tier }) => {
  const getTierColor = () => {
    switch (tier) {
      case 1:
        return 'tier-s';
      case 2:
        return 'tier-a';
      case 3:
        return 'tier-b';
      case 4:
        return 'tier-c';
      case 5:
        return 'tier-d';
      default:
        return 'tier-default';
    }
  };

  const getTierLabel = () => {
    switch (tier) {
      case 1:
        return 'S';
      case 2:
        return 'A';
      case 3:
        return 'B';
      case 4:
        return 'C';
      case 5:
        return 'D';
      default:
        return tier.toString();
    }
  };

  return (
    <View className={`tier-badge ${getTierColor()}`}>
      <Text className='tier-badge-text'>{getTierLabel()}</Text>
    </View>
  );
};
