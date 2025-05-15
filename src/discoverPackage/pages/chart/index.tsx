import { useMemo } from 'react';

import { View } from '@tarojs/components';
import { PieChart } from '@visactor/taro-vchart';
import { useRequest } from 'ahooks';

import { getArchetypes } from '@/api';
import { Loading, NavigationBar, RankBar } from '@/components';
import useModeStore from '@/store/mode';
import { useRankBarStore } from '@/store/rankBar';
import useSystemInfoStore from '@/store/systemInfo';

import { pieChartConfig } from './constants';
import { calcArchetypeData, calcClassData } from './utils';

import './index.scss';

const ChartPage: React.FC = () => {
  const mode = useModeStore(state => state.mode);

  const { currentType } = useRankBarStore(state => state);
  const { useHeight } = useSystemInfoStore();

  // 请求卡组数据
  const { data, loading } = useRequest(() => getArchetypes(mode), {
    refreshDeps: [mode],
  });

  // 处理卡组数据
  const archetypesData = useMemo(() => {
    if (data) {
      return data[currentType];
    }
    return [];
  }, [currentType, data]);

  const classSpec = useMemo(() => {
    if (archetypesData && archetypesData.length > 0) {
      const classData = calcClassData(archetypesData);
      return pieChartConfig({ title: '职业分布图', data: classData });
    }
    return null;
  }, [archetypesData]);

  const archetypeSpec = useMemo(() => {
    if (archetypesData && archetypesData.length > 0) {
      const archetypeData = calcArchetypeData(archetypesData);
      return pieChartConfig({ title: '卡组分布图', data: archetypeData });
    }
    return null;
  }, [archetypesData]);

  return (
    <View className='chart-page'>
      <NavigationBar title='今日环境' showBack showSetting={false} />
      <RankBar />
      <View className='chart-container'>
        {loading ? (
          <View className='loading-container'>
            <Loading />
          </View>
        ) : (
          <>
            {classSpec && (
              <View className='chart-box'>
                <View
                  className='chart-content'
                  style={{
                    height: useHeight / 2.2,
                  }}
                >
                  <PieChart
                    canvasId='classPieChart'
                    spec={classSpec as any}
                    style={{ height: '100%', width: '100%' }}
                  />
                </View>
              </View>
            )}
            {archetypeSpec && (
              <View className='chart-box'>
                <View
                  className='chart-content'
                  style={{
                    height: useHeight / 2.2,
                  }}
                >
                  <PieChart
                    canvasId='archetypePieChart'
                    spec={archetypeSpec as any}
                    style={{ height: '100%', width: '100%' }}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default ChartPage;
