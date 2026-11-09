import { Text, View } from 'react-native';

type TaskSummaryProps = {
  pendingCount: number;
  completedCount: number;
};

export function TaskSummary({
  pendingCount,
  completedCount,
}: TaskSummaryProps) {
  return (
    <View className="mt-7 px-5">
      <Text className="mb-4 text-xl font-bold text-taskdo-brown">
        Resumen de tus tareas
      </Text>

      <View className="flex-row gap-3">
        <View className="min-h-[125px] flex-1 justify-center rounded-2xl bg-taskdo-blue p-4">
          <Text className="text-sm font-semibold text-taskdo-brown">
            Pendientes
          </Text>

          <Text className="my-1 text-3xl font-bold text-taskdo-brown">
            {pendingCount}
          </Text>

          <Text className="text-xs text-taskdo-brown">
            Por completar
          </Text>
        </View>

        <View className="min-h-[125px] flex-1 justify-center rounded-2xl bg-taskdo-cream p-4">
          <Text className="text-sm font-semibold text-taskdo-brown">
            Completadas
          </Text>

          <Text className="my-1 text-3xl font-bold text-taskdo-brown">
            {completedCount}
          </Text>

          <Text className="text-xs text-taskdo-brown">
            Tareas realizadas
          </Text>
        </View>
      </View>
    </View>
  );
}