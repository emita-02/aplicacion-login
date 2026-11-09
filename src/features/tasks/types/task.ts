export type Task = {
  id: string;
  title: string;
  description: string | null;
  task_date: string;
  task_time: string;
  is_completed: boolean;
};

export type NewTask = {
  title: string;
  description: string | null;
  task_date: string;
  task_time: string;
};

export type TaskChanges = Partial<NewTask> & {
  is_completed?: boolean;
};