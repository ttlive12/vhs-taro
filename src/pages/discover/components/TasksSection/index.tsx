import { View } from "@tarojs/components";

import { CardType, TaskCard } from "../TaskCard";

import "./index.scss";

interface TaskItem {
  id: string;
  type: CardType;
  icon: string;
  title: string;
  subtitle: string;
  pagePath: string;
  size?: number;
}

interface TasksSectionProps {
  tasks: TaskItem[];
  onTaskClick: (pagePath: string) => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  onTaskClick,
}) => {
  return (
    <View className='tasks-section'>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          onClick={() => onTaskClick(task.pagePath)}
          {...task}
        />
      ))}
    </View>
  );
};
