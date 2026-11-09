import { supabase } from '@/lib/supabase';

import type { Task } from '../types/task';

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