import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import { NavigationBar } from '@/components';

import { CalendarSection } from './components/CalendarSection';
import { CardType } from './components/TaskCard';
import { TasksSection } from './components/TasksSection';

import './index.scss';

const tasks = [
  {
    id: 'chart',
    type: 'mint' as CardType,
    icon: 'chart',
    title: '环境图表',
    subtitle: '最新天梯职业与卡组分布图',
    pagePath: 'chart',
    size: 100,
  },
  {
    id: 'arena',
    type: 'pink' as CardType,
    icon: 'arena',
    title: '竞技场',
    subtitle: '竞技场最新职业与选牌推荐',
    pagePath: 'arena',
  },
  {
    id: 'player-rank',
    type: 'yellow' as CardType,
    icon: 'crown',
    title: '玩家排行',
    subtitle: '实时玩家排名与数据',
    pagePath: 'player-rank',
    size: 100,
  },
  {
    id: 'battlegrounds',
    type: 'battlegrounds' as CardType,
    icon: 'battlegrounds',
    title: '酒馆战棋',
    subtitle: '酒馆战棋流派推荐',
    pagePath: 'battlegrounds',
    size: 100,
  },
];

export default function Discover() {
  const handleNavigate = (page: string) => {
    Taro.navigateTo({ url: `/discoverPackage/pages/${page}/index` });
  };

  return (
    <View className='discover-page'>
      <NavigationBar title='发现' showLogo />
      <CalendarSection />
      <View className='discover-container'>
        <TasksSection tasks={tasks} onTaskClick={handleNavigate} />
      </View>
    </View>
  );
}
