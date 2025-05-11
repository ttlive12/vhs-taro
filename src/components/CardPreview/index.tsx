import { FC, useEffect,useState } from "react";

import { Image,Text, View } from "@tarojs/components";

import { useCardPreviewStore } from "../../store/cardPreviewStore";

import "./index.scss";

const CardPreview: FC = () => {
  const { show, cardId, closeCardPreview } = useCardPreviewStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (show || cardId) {
      setIsLoading(true);
    }
  }, [show, cardId]);

  const handleClose = () => {
    closeCardPreview();
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!show) return null;

  return (
    <View className='card-preview-overlay' onClick={handleClose}>
      <View className='card-preview' onClick={(e) => e.stopPropagation()}>
        <View
          className={`card-preview-container ${isLoading ? "loading" : ""}`}
        >
          {cardId && (
            <Image
              className={`preview-image full ${isLoading ? "hidden" : ""}`}
              src={`https://art.hearthstonejson.com/v1/render/latest/zhCN/256x/${cardId}.png`}
              mode='aspectFit'
              onLoad={handleImageLoad}
              onClick={handleClose}
            />
          )}
          {isLoading && (
            <View className='loading-container'>
              <View className='loading-spinner' />
              <Text className='loading-text'>加载中...</Text>
            </View>
          )}
        </View>
        <Text className='preview-tip'>点击任意处关闭</Text>
      </View>
    </View>
  );
};

export default CardPreview;
