import { Text, View } from 'react-native';

type TaskSummaryProps = {
  pendingCount: number;
  completedCount: number;
};

export function TaskSummary({
  pendingCount,
  completedCount,
}: TaskSummaryProps) {
  const totalCount = pendingCount + completedCount;

  return (
    <View className="mt-5 px-5">
      <View className="flex-row items-center justify-between rounded-2xl bg-taskdo-cream p-4">
        <View className="flex-1 pr-3">
          <Text className="mb-1 text-[10px] font-bold uppercase tracking-wider text-taskdo-brown/70">
            Resumen del día
          </Text>

          <Text className="text-sm font-bold text-taskdo-brown">
            {pendingCount === 0
              ? '¡Genial! No tienes tareas pendientes'
              : `Tienes ${pendingCount} tarea${pendingCount === 1 ? '' : 's'} pendiente${pendingCount === 1 ? '' : 's'}`}
          </Text>
        </View>

        <View className="h-12 w-12 items-center justify-center rounded-xl bg-taskdo-brown">
          <Text className="text-base font-bold text-taskdo-cream">
            {completedCount}
          </Text>

          <View className="flex-row items-center">
            <Text className="text-[9px] text-taskdo-cream/80">
              /{totalCount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
