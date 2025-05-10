import { View, Text, Image } from "@tarojs/components";
import { useCardPreviewStore } from "../../store/cardPreviewStore";
import "./index.scss";

interface CardFrameProps {
  cardId: string;
  cost: number;
  name: string;
  rarity: string;
  back?: string;
  onClick?: (cardId: string) => void;
}

export const CardFrame: React.FC<CardFrameProps> = ({
  cardId,
  cost,
  name,
  rarity,
  back = "",
  onClick,
}) => {
  const { setCardPreview } = useCardPreviewStore();

  const handleTap = () => {
    // Show card preview
    setCardPreview(cardId);
    
    // Also call the original onClick if provided
    if (onClick) {
      onClick(cardId);
    }
  };

  return (
    <View className="card" onClick={handleTap}>
      <View className="card-name">
        <Text>{cost}</Text>
        <Text>{name}</Text>
        {back && (
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
