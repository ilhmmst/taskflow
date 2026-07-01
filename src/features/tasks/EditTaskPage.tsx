import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useTasks, useUpdateTask } from '../../hooks/useTasks';
import { Button } from '../../utilities/components/Button';

const editTaskSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
});

type EditTaskFormInputs = z.infer<typeof editTaskSchema>;

export const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tasks = [] } = useTasks();
  const updateTask = useUpdateTask();

  const task = tasks.find((t) => t.id === id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTaskFormInputs>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? '',
      });
    }
  }, [task, reset]);

  const onSubmit = (data: EditTaskFormInputs) => {
    if (!id) return;
    updateTask.mutate(
      { id, title: data.title, description: data.description },
      { onSuccess: () => navigate('/dashboard') }
    );
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
          EDIT TUGAS
        </span>
      </header>

      <main className="main-container py-8 px-4 md:px-6">
        {!task ? (
          <div className="py-24 text-center font-subHeading text-primary/50 text-sm">
            Tugas tidak ditemukan.
          </div>
        ) : (
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
                  isLoading={updateTask.isPending}
                  className="flex-1 rounded-lg font-heading text-xs tracking-widest"
                >
                  SIMPAN PERUBAHAN
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
