import { Pressable, Text, View } from 'react-native';

import { TaskEmptyState } from './task-empty-state';
import type { Task } from '../types/task';

export type { Task } from '../types/task';

type TaskListProps = {
  tasks: Task[];
  hasTasks: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
};

export function TaskList({
  tasks,
  hasTasks,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <TaskEmptyState hasTasks={hasTasks} />;
  }

  return (
    <View className="mt-4 gap-3">
      {tasks.map((task) => (
        <View
          key={task.id}
          className={`rounded-2xl border border-taskdo-gray p-4 ${
            task.is_completed ? 'bg-taskdo-blue' : 'bg-taskdo-cream'
          }`}
        >
          <View className="flex-row items-start gap-3">
            <Pressable
              onPress={() => onToggleComplete(task)}
              className="mt-1 h-7 w-7 items-center justify-center rounded-full border-2 border-taskdo-brown"
              accessibilityRole="button"
              accessibilityLabel={
                task.is_completed
                  ? 'Marcar como pendiente'
                  : 'Marcar como completada'
              }
            >
              {task.is_completed ? (
                <Text className="font-bold text-taskdo-brown">✓</Text>
              ) : null}
            </Pressable>

            <View className="flex-1">
              <Text
                className={`text-base font-bold text-taskdo-brown ${
                  task.is_completed ? 'line-through opacity-50' : ''
                }`}
              >
                {task.title}
              </Text>

              {task.description ? (
                <Text
                  className={`mt-1 text-sm text-taskdo-brown ${
                    task.is_completed ? 'opacity-50' : ''
                  }`}
                >
                  {task.description}
                </Text>
              ) : null}

              <Text className="mt-3 text-xs text-taskdo-brown">
                ▣ {task.task_date} · {task.task_time.slice(0, 5)}
              </Text>

              <Text className="mt-2 text-xs font-semibold text-taskdo-brown">
                {task.is_completed ? 'COMPLETADA' : 'PENDIENTE'}
              </Text>
            </View>

            <View className="gap-3">
              <Pressable
                onPress={() => onDelete(task)}
                accessibilityLabel="Eliminar tarea"
                className="h-9 w-9 items-center justify-center rounded-lg"
              >
                <Text className="text-xl text-taskdo-brown">▤</Text>
              </Pressable>

              <Pressable
                onPress={() => onEdit(task)}
                accessibilityLabel="Editar tarea"
                className="h-9 w-9 items-center justify-center rounded-lg bg-taskdo-gray"
              >
                <Text className="text-lg text-taskdo-brown">✎</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}