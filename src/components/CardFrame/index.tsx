import { useMemo } from "react";

import { Image, Text, View } from "@tarojs/components";

import { Rarity } from "@/constants/enums";

import { useCardPreviewStore } from "../../store/cardPreviewStore";

import "./index.scss";

interface CardFrameProps {
  cardId: string;
  cost: number;
  name: string;
  rarity: Rarity;
  count?: number;
  triggerCardPreview?: boolean;
  onClick?: (cardId: string) => void;
}

export const CardFrame: React.FC<CardFrameProps> = ({
  cardId,
  cost,
  name,
  rarity,
  count,
  onClick,
  triggerCardPreview = true,
}) => {
  const { setCardPreview } = useCardPreviewStore();

  const handleTap = () => {
    if (triggerCardPreview) {
      setCardPreview(cardId);
    }
    if (onClick) {
      onClick(cardId);
    }
  };

  const back = useMemo(() => {
    if (rarity === Rarity.LEGENDARY) {
      return "⋆";
    }
    if (count === 1) {
      return "";
    }
    return count;
  }, [rarity, count]);

  return (
    <View className="card" onClick={handleTap}>
      <View className="card-name">
        <Text>{cost}</Text>
        <Text>{name}</Text>
        {count && (
          <Text className={`card-name-back ${back === "⋆" ? "legend" : ""}`}>
            {back}
          </Text>
        )}
      </View>
      <View className="card-frame">
        <View className={`card-frame-countbox ${rarity}`} />
        <Image
          className="card-frame-image"
          src={`https://art.hearthstonejson.com/v1/tiles/${cardId}.webp`}
          mode="aspectFill"
          lazyLoad
        />
      </View>
    </View>
  );
};
