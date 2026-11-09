import { Text, View } from 'react-native';

import { TaskEmptyState } from './task-empty-state';
import type { Task } from '../types/task';


export type { Task } from '../types/task';

type TaskListProps = {
  tasks: Task[];
  hasTasks: boolean;
};

export function TaskList({ tasks, hasTasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <TaskEmptyState hasTasks={hasTasks} />;
  }

  return (
    <View className="mt-4 gap-3">
      {tasks.map((task) => (
        <View
          key={task.id}
          className="rounded-2xl border border-taskdo-gray bg-taskdo-cream p-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-base font-bold text-taskdo-brown">
                {task.title}
              </Text>

              {task.description ? (
                <Text className="mt-2 text-sm text-taskdo-brown">
                  {task.description}
                </Text>
              ) : null}

              <Text className="mt-3 text-xs text-taskdo-brown">
                {task.task_date} · {task.task_time}
              </Text>
            </View>

            <View
              className={`ml-3 rounded-full px-3 py-2 ${
                task.is_completed
                  ? 'bg-taskdo-blue'
                  : 'bg-white'
              }`}
            >
              <Text className="text-xs font-semibold text-taskdo-brown">
                {task.is_completed ? 'Completada' : 'Pendiente'}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}