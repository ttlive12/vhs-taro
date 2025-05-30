import { useMemo } from 'react';

import { ScrollView, Text, View } from '@tarojs/components';
import { pxTransform } from '@tarojs/taro';
import { useRequest } from 'ahooks';

import { getSpecialDates } from '@/api';
import { SpecialDate } from '@/models/config';
import { rpx2px } from '@/utils';

import './index.scss';

interface WeekDay {
  name: string;
  date: number;
  isToday: boolean;
  fullDate: string; // 添加完整日期，格式如：2023.05.14
  description?: string; // 添加描述字段
}

export const CalendarSection: React.FC = () => {
  const { data: specialDates } = useRequest(getSpecialDates);

  const weekDays = useMemo(() => {
    // 获取当前日期
    const today = new Date();
    const currentDay = today.getDate();

    const result: WeekDay[] = [];
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    // 以今天为中心，显示左三天和右三天
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(currentDay + i);

      // 获取星期几
      const weekDayIndex = date.getDay();
      // 调整为以周一为0，周日为6
      const adjustedWeekDayIndex = weekDayIndex === 0 ? 6 : weekDayIndex - 1;

      // 格式化完整日期为 YYYY.MM.DD
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const fullDate = `${year}.${month}.${day}`;

      // 查找特殊日期描述
      let description;
      if (specialDates && specialDates.length > 0) {
        const specialDate = specialDates.find((item: SpecialDate) => item.date === fullDate);
        if (specialDate) {
          description = specialDate.description;
        }
      }

      result.push({
        name: dayNames[adjustedWeekDayIndex],
        date: date.getDate(),
        isToday: i === 0,
        fullDate,
        description,
      });
    }

    return result;
  }, [specialDates]);

  return (
    <View className='calendar-section'>
      <ScrollView
        className='calendar-scroll'
        scrollX
        showScrollbar={false}
        scrollWithAnimation
        scrollLeft={rpx2px(205)}
        enhanced
      >
        <View style={{ width: pxTransform(30), display: 'inline-block' }} />
        <View className='calendar-days'>
          {weekDays.map((day, index) => (
            <View
              key={`${day.name}-${index}`}
              className={`calendar-day ${day.isToday ? 'active' : ''}`}
            >
              <Text className='day-name'>{day.name}</Text>
              <Text className='day-date'>{day.date}</Text>
              {day.description && (
                <Text
                  className='day-description'
                  style={{ color: day.isToday ? '#fff' : 'rgba(#ed6a0c, 0.6)' }}
                >
                  {day.description}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
