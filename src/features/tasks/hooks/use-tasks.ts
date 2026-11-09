import { useCallback, useEffect, useState } from 'react';

import { getTasks } from '../services/task-service';
import type { Task } from '../types/task';

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

  return {
    tasks,
    isLoading,
    error,
    refreshTasks: fetchTasks,
  };
}