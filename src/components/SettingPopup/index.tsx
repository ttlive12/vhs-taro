import { useState } from 'react';

import { Button, Popup, Radio } from '@taroify/core';
import { ClockOutlined, CommentOutlined, Cross, Icon, QuestionOutlined } from '@taroify/icons';
import { Image, Text, View } from '@tarojs/components';
import { useRequest } from 'ahooks';

import { getLastUpdateTime } from '@/api';
import useModeStore from '@/store/mode';
import { RankType, useRankTypeStore } from '@/store/rankType';
import { rpx2px } from '@/utils/pixel';

import { standard, wild } from '@/assets/image';

import { TitleBar } from '../TitleBar';

import './index.scss';

interface SettingPopupProps {
  visible: boolean;
  onClose: () => void;
}

const SettingPopup: React.FC<SettingPopupProps> = ({ visible, onClose }) => {
  const { mode, toggleMode } = useModeStore();
  const { rankType, setRankType } = useRankTypeStore();

  const [rotate, setRotate] = useState(false);

  const handleModeSwitch = () => {
    setRotate(true);
    setTimeout(() => {
      toggleMode();
    }, 200);
    setTimeout(() => {
      setRotate(false);
    }, 400);
  };

  const { data: updateInfo } = useRequest(getLastUpdateTime, {
    ready: visible,
  });

  const handleRankTypeChange = (value: RankType) => {
    setRankType(value);
  };

  return (
    <Popup open={visible} rounded style={{ width: '80%' }} onClose={onClose} placement='center'>
      <View className='setting-popup'>
        {/* 模式切换 */}
        <View className='mode'>
          <Image
            className={`mode-icon ${rotate ? 'rotate' : ''}`}
            src={mode === 'standard' ? standard : wild}
            onClick={handleModeSwitch}
          />
          <Text className='mode-name'>{mode === 'standard' ? '标准模式' : '狂野模式'}</Text>
          <Icon
            className='mode-switch'
            classPrefix='icon'
            name='switch'
            size={rpx2px(40)}
            onClick={handleModeSwitch}
          />
        </View>

        {/* 排行榜设置 */}
        <View className='setting-item full-width'>
          <TitleBar
            title='排行榜设置'
            icon={<Icon classPrefix='icon' name='rank' color='#333333' size={rpx2px(40)} />}
          />

          <View className='setting-body'>
            <Radio.Group value={rankType} direction='horizontal' onChange={handleRankTypeChange}>
              <Radio name={RankType.COMBINED}>综合排行</Radio>
              <Radio name={RankType.WINRATE}>胜率排行</Radio>
            </Radio.Group>
          </View>
        </View>

        <View className='setting-item-group'>
          {/* 数据更新 */}
          <View className='setting-item'>
            <View className='setting-header'>
              <ClockOutlined size={rpx2px(40)} />
              <Text>数据更新</Text>
            </View>
            <View className='setting-body'>
              <Text>最近更新时间</Text>
              <Text>{updateInfo?.description}</Text>
            </View>
          </View>
          {/* 意见反馈 */}
          <View className='setting-item'>
            <View className='setting-header'>
              <CommentOutlined size={rpx2px(40)} />
              <Text>意见反馈</Text>
            </View>
            <View className='setting-body'>
              <Text>欢迎分享，评分</Text>
              <Button className='feedback-button' openType='feedback'>
                前往反馈
              </Button>
            </View>
          </View>
        </View>

        {/* 更新日志 */}
        <View className='setting-item full-width'>
          <View className='setting-header'>
            <QuestionOutlined size={rpx2px(40)} />
            <Text>更新日志</Text>
          </View>
          <View className='setting-body'>
            <Text>当前版本：3.2.1</Text>
            <Text>更新内容：新增酒馆战棋，样式和逻辑优化</Text>
          </View>
        </View>
      </View>
      {/* 关闭 */}
      <Cross className='close-button' onClick={onClose} size={rpx2px(40)} />
    </Popup>
  );
};

export default SettingPopup;
