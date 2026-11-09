import { Text, View } from 'react-native';

type TaskEmptyStateProps = {
  hasTasks: boolean;
};

export function TaskEmptyState({
  hasTasks,
}: TaskEmptyStateProps) {
  return (
    <View className="mt-4 items-center justify-center rounded-2xl bg-white px-7 py-10">
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-taskdo-blue">
        <Text className="text-3xl font-bold text-taskdo-brown">
          ✓
        </Text>
      </View>

      <Text className="text-center text-lg font-bold text-taskdo-brown">
        {hasTasks
          ? 'No encontramos resultados'
          : '¡Todo está en orden!'}
      </Text>

      <Text className="mt-2 text-center text-sm leading-6 text-taskdo-gray">
        {hasTasks
          ? 'Intenta cambiar el filtro o modificar tu búsqueda.'
          : 'Todavía no tienes tareas registradas. Agrega una nueva tarea para comenzar a organizar tu día.'}
      </Text>
    </View>
  );
}