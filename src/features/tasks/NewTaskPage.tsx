import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useCreateTask } from '../../hooks/useTasks';
import { Button } from '../../utilities/components/Button';

const taskSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
});

type TaskFormInputs = z.infer<typeof taskSchema>;

export const NewTaskPage = () => {
  const navigate = useNavigate();
  const createTask = useCreateTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data: TaskFormInputs) => {
    createTask.mutate(data, {
      onSuccess: () => navigate('/dashboard'),
    });
  };

  return (
    <div className="min-h-screen bg-third text-primary font-subHeading">
      {/* Header */}
      <header className="bg-primary sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-secondary hover:text-secondary/70 transition"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-heading text-secondary text-lg tracking-widest">
          BUAT TUGAS BARU
        </span>
      </header>

      <main className="main-container py-8 px-4 md:px-6">
        <div className="max-w-lg bg-fourty border border-third rounded-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block font-heading text-xs uppercase tracking-widest text-primary mb-2">
                Judul Tugas
              </label>
              <input
                {...register('title')}
                placeholder="Masukkan judul tugas..."
                className="w-full border border-third rounded-lg px-4 py-2.5 text-sm font-subHeading bg-transparent focus:outline-none focus:ring-2 focus:ring-secondary transition"
              />
              {errors.title && (
                <span className="text-red-500 font-subHeading text-xs mt-1 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div>
              <label className="block font-heading text-xs uppercase tracking-widest text-primary mb-2">
                Deskripsi (Opsional)
              </label>
              <textarea
                {...register('description')}
                placeholder="Tambahkan deskripsi..."
                rows={4}
                className="w-full border border-third rounded-lg px-4 py-2.5 text-sm font-subHeading bg-transparent focus:outline-none focus:ring-2 focus:ring-secondary transition resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => navigate('/dashboard')}
                className="flex-1 rounded-lg"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="md"
                isLoading={createTask.isPending}
                className="flex-1 rounded-lg font-heading text-xs tracking-widest"
              >
                SIMPAN
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
