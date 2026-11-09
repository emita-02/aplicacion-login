
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
    <View className="mt-3 gap-2.5">
      {tasks.map((task) => (
        <View
          key={task.id}
          className={`flex-row items-start gap-3 rounded-2xl border p-3.5 ${
            task.is_completed
              ? 'border-taskdo-gray bg-white/40 opacity-75'
              : 'border-taskdo-brown/20 bg-taskdo-cream'
          }`}
        >
          <Pressable
            onPress={() => onToggleComplete(task)}
            className="mt-0.5 h-6 w-6 shrink-0 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={
              task.is_completed
                ? 'Marcar como pendiente'
                : 'Marcar como completada'
            }
          >
            <View
              className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                task.is_completed
                  ? 'border-taskdo-brown bg-taskdo-blue'
                  : 'border-taskdo-brown/60 bg-transparent'
              }`}
            >
              {task.is_completed ? (
                <Text className="text-xs font-bold text-taskdo-brown">
                  ✓
                </Text>
              ) : null}
            </View>
          </Pressable>

          <View className="min-w-0 flex-1">
            <Text
              className={`text-xs font-bold leading-snug text-taskdo-brown ${
                task.is_completed ? 'line-through opacity-50' : ''
              }`}
            >
              {task.title}
            </Text>

            {task.description ? (
              <Text
                numberOfLines={2}
                className={`mt-1 text-[11px] ${
                  task.is_completed
                    ? 'text-taskdo-brown/40'
                    : 'text-taskdo-brown/80'
                }`}
              >
                {task.description}
              </Text>
            ) : null}

            <View className="mt-2 flex-row flex-wrap items-center gap-1.5">
              <View className="flex-row items-center rounded-md border border-taskdo-gray/50 bg-white/60 px-1.5 py-1">
                <Text className="mr-1 text-[10px] text-taskdo-brown">
                  ▦
                </Text>

                <Text className="text-[9px] font-medium text-taskdo-brown">
                  {task.task_date} · {task.task_time.slice(0, 5)}
                </Text>
              </View>

              <Text
                className={`text-[9px] font-bold ${
                  task.is_completed
                    ? 'text-taskdo-brown/50'
                    : 'text-taskdo-brown'
                }`}
              >
                {task.is_completed ? 'COMPLETADA' : 'PENDIENTE'}
              </Text>
            </View>
          </View>

          <View className="shrink-0 items-center gap-2 pt-0.5">
            <Pressable
              onPress={() => onDelete(task)}
              accessibilityRole="button"
              accessibilityLabel="Eliminar tarea"
              className="h-8 w-8 items-center justify-center rounded-lg"
            >
              <Text className="text-lg text-taskdo-brown/50">
                🗑
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onEdit(task)}
              accessibilityRole="button"
              accessibilityLabel="Editar tarea"
              className="h-8 w-8 items-center justify-center rounded-lg border border-taskdo-gray/60 bg-taskdo-blue/60"
            >
              <Text className="text-base text-taskdo-brown">
                🖊
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}
