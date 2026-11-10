import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
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

import type { NewTask, Task } from '@/features/tasks/types/task';
import { LottieAnimation } from '@/components/lottie-animation';

export default function HomeScreen() {
  const { user } = useAuth();

  const {
    tasks,
    isLoading,
    error,
    refreshTasks,
    addTask,
    updateTask,
    removeTask,
  } = useTasks(user?.id);

  const [selectedFilter, setSelectedFilter] =
    useState<TaskFilter>('all');

  const [searchValue, setSearchValue] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formKey, setFormKey] = useState(0);

  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const showError = (message: string) => {
    setErrorMessage(message);
    setIsErrorVisible(true);
  };

  const handleSaveTask = async (
    taskData: NewTask & { is_completed: boolean }
  ) => {
    setIsSaving(true);

    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData);

        setSuccessMessage('Los cambios se guardaron correctamente.');
      } else {
        await addTask(taskData);

        setSuccessMessage('Tu tarea se creó correctamente.');
      }

      setIsSuccessVisible(true);

      setIsFormVisible(false);
      setSelectedTask(null);
    } catch (err) {
      console.error('Error al guardar la tarea:', err);

      showError('No se pudieron guardar los cambios. Inténtalo nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setFormKey((current) => current + 1);
    setIsFormVisible(true);
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Eliminar tarea',
      `¿Estás seguro de que deseas eliminar "${task.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTask(task.id);

              setSuccessMessage('La tarea se eliminó correctamente.');
              setIsSuccessVisible(true);

            } catch (err) {
              console.error('Error al eliminar la tarea:', err);

              showError('No se pudo eliminar la tarea.');
            }
          },
        },
      ]
    );
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task.id, {
        is_completed: !task.is_completed,
      });
    } catch (err) {
      console.error('Error al cambiar el estado:', err);

      showError('No se pudo actualizar el estado de la tarea.');
    }
  };



  return (
    <View className="flex-1 bg-taskdo-blue">
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

          {isLoading ? (
            <View className="mt-8 items-center justify-center">
              <LottieAnimation
                name="loading"
                size={140}
                loop
              />

              <Text className="mt-2 text-center text-taskdo-brown">
                Cargando tus tareas...
              </Text>
            </View>
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
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-5 right-5">
        <Pressable
          onPress={() => {
            setIsFormVisible(true);
            setSelectedTask(null);
            setFormKey((current) => current + 1);
          }}
          accessibilityRole="button"
          accessibilityLabel="Crear nueva tarea"
          className="h-14 w-14 items-center justify-center rounded-full border-2 border-taskdo-cream bg-taskdo-brown shadow-lg"
        >
          <Text className="text-3xl font-light text-taskdo-cream">
            +
          </Text>
        </Pressable>
      </View>

      <TaskForm
        key={formKey}
        visible={isFormVisible}
        isSaving={isSaving}
        initialTask={selectedTask}
        onClose={() => {
          setIsFormVisible(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSaveTask}
      />

      <Modal
        visible={isSuccessVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSuccessVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-8">
          <View className="w-full items-center rounded-3xl bg-white px-7 py-8">
            <LottieAnimation
              name="success"
              size={150}
            />

            <Text className="mt-3 text-xl font-bold text-taskdo-brown">
              ¡Excelente!
            </Text>

            <Text className="mt-2 text-center text-sm leading-6 text-taskdo-gray">
              {successMessage}
            </Text>

            <Pressable
              onPress={() => setIsSuccessVisible(false)}
              className="mt-6 w-full items-center rounded-xl bg-taskdo-brown py-3"
            >
              <Text className="font-semibold text-white">
                Continuar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isErrorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsErrorVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-8">
          <View className="w-full items-center rounded-3xl bg-white px-7 py-8">
            <LottieAnimation
              name="error"
              size={150}
            />

            <Text className="mt-3 text-xl font-bold text-taskdo-brown">
              ¡Ups! Algo salió mal
            </Text>

            <Text className="mt-2 text-center text-sm leading-6 text-taskdo-gray">
              {errorMessage}
            </Text>

            <Pressable
              onPress={() => setIsErrorVisible(false)}
              className="mt-6 w-full items-center rounded-xl bg-taskdo-brown py-3"
            >
              <Text className="font-semibold text-white">
                Entendido
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}