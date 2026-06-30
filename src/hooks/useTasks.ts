import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi, storage } from '../api/mockApi';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

// 1. Fetch Tasks
export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      await mockApi.get('/tasks').catch(() => {});
      return storage.getTasks();
    },
  });
};

// 2. Create Task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      newTask: Omit<Task, 'id' | 'createdAt' | 'completed'>
    ) => {
      await mockApi.post('/tasks').catch(() => {});
      const tasks = storage.getTasks();
      const created: Task = {
        ...newTask,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      storage.saveTasks([created, ...tasks]);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// 3. Update Task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedTask: { id: string; title: string; description?: string }) => {
      await mockApi.put(`/tasks/${updatedTask.id}`).catch(() => {});
      return storage.updateTask(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// 4. Toggle Status (Sudah ada di langkah sebelumnya, pastikan tipenya sinkron)
export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      await mockApi.patch(`/tasks/${taskId}`).catch(() => {});

      const currentTasks = storage.getTasks();
      const targetTask = currentTasks.find(t => t.id === taskId);
      
      return storage.updateTask(taskId, { completed: !targetTask?.completed });
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) =>
        old?.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

// 5. Delete Task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      await mockApi.delete(`/tasks/${taskId}`).catch(() => {});
      
      return storage.deleteTask(taskId);
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) =>
        old?.filter((t) => t.id !== taskId)
      );
      return { previousTasks };
    },
    onError: (_err, _variables, context) =>
      queryClient.setQueryData(['tasks'], context?.previousTasks),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

// 6. Advanced: Bulk Delete
export const useBulkDeleteTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      await mockApi.post('/tasks/bulk-delete').catch(() => {});
      const tasks = storage.getTasks();
      storage.saveTasks(tasks.filter((t: Task) => !taskIds.includes(t.id)));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

// 7. Advanced: Bulk Complete
export const useBulkCompleteTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      await mockApi.post('/tasks/bulk-complete').catch(() => {});
      const tasks = storage.getTasks();
      storage.saveTasks(
        tasks.map((t: Task) =>
          taskIds.includes(t.id) ? { ...t, completed: true } : t
        )
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};
