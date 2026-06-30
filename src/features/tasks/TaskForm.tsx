import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTask } from '../../hooks/useTasks';

const taskSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
});

type TaskFormInputs = z.infer<typeof taskSchema>;

export const TaskForm = () => {
  const createTask = useCreateTask();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data: TaskFormInputs) => {
    createTask.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6"
    >
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            {...register('title')}
            placeholder="Tambah tugas baru..."
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.title.message}
            </span>
          )}
        </div>
        <div className="flex-1">
          <input
            {...register('description')}
            placeholder="Deskripsi (opsional)..."
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={createTask.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition disabled:bg-gray-400"
        >
          {createTask.isPending ? 'Menyimpan...' : 'Tambah'}
        </button>
      </div>
    </form>
  );
};
