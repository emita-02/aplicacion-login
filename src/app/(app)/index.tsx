import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { HomeHeader } from '@/features/tasks/components/home-header';
import { TaskSummary } from '@/features/tasks/components/task-summary';
import { TaskFilters, type TaskFilter } from '@/features/tasks/components/task-filters';
import { TaskList } from '@/features/tasks/components/task-list';
import { TaskForm } from '@/features/tasks/components/task-form';
import { useTasks } from '@/features/tasks/hooks/use-tasks';
import { useAuth } from '@/providers/auth-provider';

import type { NewTask } from '@/features/tasks/types/task';

export default function HomeScreen() {
  const { user } = useAuth();

  const {
    tasks,
    isLoading,
    error,
    refreshTasks,
    addTask,
  } = useTasks(user?.id);

  const [selectedFilter, setSelectedFilter] =
    useState<TaskFilter>('all');

  const [searchValue, setSearchValue] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleCreateTask = async (newTask: NewTask) => {
    setIsSaving(true);

    try {
      await addTask(newTask);
      setIsFormVisible(false);
      Alert.alert('¡Tarea creada!', 'Tu tarea se guardó correctamente.');
    } catch (err) {
      console.error('Error al crear la tarea:', err);
      Alert.alert(
        'Error',
        'No se pudo guardar la tarea. Inténtalo nuevamente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

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

          <Pressable
            onPress={() => setIsFormVisible(true)}
            className="mt-5 items-center rounded-xl bg-taskdo-brown py-4"
          >
            <Text className="font-bold text-white">
              + Nueva tarea
            </Text>
          </Pressable>

          <TaskFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />

          {isLoading ? (
            <Text className="mt-8 text-center text-taskdo-brown">
              Cargando tus tareas...
            </Text>
          ) : error ? (
            <View className="mt-6 items-center gap-3">
              <Text className="text-center text-taskdo-brown">
                {error}
              </Text>

              <Pressable
                onPress={refreshTasks}
                className="rounded-xl bg-taskdo-brown px-5 py-3"
              >
                <Text className="font-semibold text-white">
                  Intentar nuevamente
                </Text>
              </Pressable>
            </View>
          ) : (
            <TaskList
              tasks={filteredTasks}
              hasTasks={tasks.length > 0}
            />
          )}
        </View>
      </ScrollView>

      <TaskForm
        visible={isFormVisible}
        isSaving={isSaving}
        onClose={() => setIsFormVisible(false)}
        onSubmit={handleCreateTask}
      />
    </View>
  );
}