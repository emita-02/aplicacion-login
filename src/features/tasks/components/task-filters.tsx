import { Text, TextInput, Pressable, View } from 'react-native';

export type TaskFilter = 'all' | 'pending' | 'completed';

type TaskFiltersProps = {
  selectedFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
};

const filters: { label: string; value: TaskFilter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Completadas', value: 'completed' },
];

export function TaskFilters({
  selectedFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
}: TaskFiltersProps) {
  return (
    <View className="mt-6 gap-4">
      <TextInput
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder="Buscar una tarea..."
        placeholderTextColor="#7A706D"
        className="rounded-2xl border border-taskdo-gray bg-white px-4 py-3 text-base text-taskdo-brown"
      />

      <View className="flex-row gap-2">
        {filters.map((filter) => {
          const isSelected = selectedFilter === filter.value;

          return (
            <Pressable
              key={filter.value}
              onPress={() => onFilterChange(filter.value)}
              className={`flex-1 items-center rounded-xl px-2 py-3 ${
                isSelected
                  ? 'bg-taskdo-brown'
                  : 'border border-taskdo-gray bg-white'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isSelected
                    ? 'text-white'
                    : 'text-taskdo-brown'
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}