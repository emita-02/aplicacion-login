import { useCallback, useEffect, useState } from 'react';

import {
  createTask as createTaskService,
  getTasks,
} from '../services/task-service';

import type { NewTask, Task } from '../types/task';

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getTasks(userId);
      setTasks(data);
    } catch (err) {
      console.error('Error al obtener las tareas:', err);
      setError('No se pudieron cargar las tareas.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let isActive = true;

    const loadTasks = async () => {
      if (!userId) {
        return;
      }

      try {
        const data = await getTasks(userId);

        if (isActive) {
          setTasks(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error al obtener las tareas:', err);

        if (isActive) {
          setError('No se pudieron cargar las tareas.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      isActive = false;
    };
  }, [userId]);

  const addTask = useCallback(
    async (newTask: NewTask) => {
      if (!userId) {
        throw new Error('No hay un usuario autenticado.');
      }

      const createdTask = await createTaskService(userId, newTask);

      setTasks((currentTasks) =>
        [...currentTasks, createdTask].sort((a, b) => {
          const dateComparison = a.task_date.localeCompare(b.task_date);

          if (dateComparison !== 0) {
            return dateComparison;
          }

          return a.task_time.localeCompare(b.task_time);
        })
      );

      return createdTask;
    },
    [userId]
  );

  return {
    tasks,
    isLoading,
    error,
    refreshTasks: fetchTasks,
    addTask,
  };
}