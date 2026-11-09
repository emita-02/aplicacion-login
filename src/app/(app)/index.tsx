import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { HomeHeader } from '@/features/tasks/components/home-header';
import { TaskSummary } from '@/features/tasks/components/task-summary';
import {
  TaskFilters,
  type TaskFilter,
} from '@/features/tasks/components/task-filters';
import {
  TaskList,
  type Task,
} from '@/features/tasks/components/task-list';

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<TaskFilter>('all');

  const [searchValue, setSearchValue] = useState('');

  // Temporalmente vacío. Después se obtendrán las tareas de Supabase.
  const tasks: Task[] = [];

  const pendingCount = tasks.filter(
    (task) => !task.is_completed
  ).length;

  const completedCount = tasks.filter(
    (task) => task.is_completed
  ).length;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'pending' && !task.is_completed) ||
        (selectedFilter === 'completed' && task.is_completed);

      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, selectedFilter, searchValue]);

  return (
    <View className="flex-1 bg-[#F2F2F2]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <HomeHeader />

        <TaskSummary
          pendingCount={pendingCount}
          completedCount={completedCount}
        />

        <View className="mt-8 px-5">
          <Text className="text-xl font-bold text-taskdo-brown">
            Mis tareas
          </Text>

          <Text className="mt-1 text-sm text-[#7A706D]">
            Organiza tus actividades
          </Text>

          <TaskFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />

          <TaskList
            tasks={filteredTasks}
            hasTasks={tasks.length > 0}
          />
        </View>
      </ScrollView>
    </View>
  );
}