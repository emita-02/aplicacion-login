import { supabase } from '@/lib/supabase';

import type { NewTask, Task } from '../types/task';

export async function getTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(
      'id, title, description, task_date, task_time, is_completed'
    )
    .eq('user_id', userId)
    .order('task_date', { ascending: true })
    .order('task_time', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createTask(
  userId: string,
  newTask: NewTask
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      ...newTask,
    })
    .select(
      'id, title, description, task_date, task_time, is_completed'
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}