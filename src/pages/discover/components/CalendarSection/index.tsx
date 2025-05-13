import { useMemo } from "react";

import { ScrollView, Text, View } from "@tarojs/components";

import "./index.scss";

interface WeekDay {
  name: string;
  date: number;
  isToday: boolean;
}

interface CalendarSectionProps {
  title?: string;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  title = "Calendar",
}) => {
  const weekDays = useMemo(() => {
    // 获取当前日期
    const today = new Date();
    const currentDay = today.getDate();
    const currentWeekDay = today.getDay();

    const result: WeekDay[] = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      // 计算日期，今天是周三，则对应索引2
      const dayOffset =
        i - (currentWeekDay - 1) + (currentWeekDay === 0 ? -6 : 0);
      const date = new Date(today);
      date.setDate(currentDay + dayOffset);
      result.push({
        name: dayNames[i % 7],
        date: date.getDate(),
        isToday: dayOffset === 0,
      });
    }

    return result;
  }, []);

  return (
    <View className='calendar-section'>
      <ScrollView
        className='calendar-scroll'
        scrollX
        showScrollbar={false}
        enhanced
      >
        <View style={{ width: 15, display: "inline-block" }} />
        <View className='calendar-days'>
          {weekDays.map((day, index) => (
            <View
              key={`${day.name}-${index}`}
              className={`calendar-day ${day.isToday ? "active" : ""}`}
            >
              <Text className='day-name'>{day.name}</Text>
              <Text className='day-date'>{day.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
