import { FC, useEffect, useState } from 'react';

import { Image, Text, View } from '@tarojs/components';

import { useCardPreviewStore } from '../../store/cardPreviewStore';
import { DelayRender } from '../DelayRender';

import './index.scss';

type CardPreviewMode = 'render' | 'bgs';

interface CardPreviewProps {
  mode?: CardPreviewMode;
}

const CardPreview: FC<CardPreviewProps> = ({ mode = 'render' }) => {
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

  useEffect(() => {
    return () => {
      closeCardPreview();
    };
  }, [closeCardPreview]);

  if (!show) return null;

  return (
    <View className='card-preview-overlay' onClick={handleClose}>
      <View className='card-preview' onClick={e => e.stopPropagation()}>
        <View className={`card-preview-container ${isLoading ? 'loading' : ''}`}>
          {cardId && (
            <Image
              className={`preview-image full ${isLoading ? 'hidden' : ''}`}
              src={`https://art.hearthstonejson.com/v1/${mode}/latest/zhCN/256x/${cardId}.png`}
              mode='aspectFit'
              onLoad={handleImageLoad}
              onClick={handleClose}
            />
          )}
          {isLoading && (
            <DelayRender delay={200}>
              <View className='loading-container'>
                <View className='loading-spinner' />
                <Text className='loading-text'>加载中...</Text>
              </View>
            </DelayRender>
          )}
        </View>
        <Text className='preview-tip'>点击任意处关闭</Text>
      </View>
    </View>
  );
};

export default CardPreview;
