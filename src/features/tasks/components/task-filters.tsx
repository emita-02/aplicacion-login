
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
  { label: 'Listas', value: 'completed' },
];

export function TaskFilters({
  selectedFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
}: TaskFiltersProps) {
  return (
    <View className="mt-4 gap-3">
      <View className="flex-row items-center rounded-xl border border-taskdo-gray bg-white/70 px-3">
        <Text className="mr-2 text-lg text-taskdo-brown/50">
          ⌕
        </Text>

        <TextInput
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder="Buscar tarea..."
          placeholderTextColor="#7A706D"
          className="flex-1 py-3 text-xs text-taskdo-brown"
        />
      </View>

      <View className="flex-row rounded-xl bg-taskdo-gray/50 p-1">
        {filters.map((filter) => {
          const isSelected = selectedFilter === filter.value;

          return (
            <Pressable
              key={filter.value}
              onPress={() => onFilterChange(filter.value)}
              className={`flex-1 items-center rounded-lg py-2 ${
                isSelected ? 'bg-taskdo-brown' : ''
              }`}
            >
              <Text
                className={`text-[11px] font-semibold ${
                  isSelected
                    ? 'text-taskdo-cream'
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
