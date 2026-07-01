import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import gsap from 'gsap';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '../../hooks/useTasks';
import { Input } from '../../utilities/components/Input';
import { Button } from '../../utilities/components/Button';

// ─── Schema ──────────────────────────────────────────────────────────────────

const taskSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
});

type TaskFormInputs = z.infer<typeof taskSchema>;

// ─── Component ───────────────────────────────────────────────────────────────

export const TaskFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Exit animation helper — animates containerRef out then navigates
  const navigateTo = (path: string) => {
    try {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => navigate(path),
      });
    } catch {
      navigate(path);
    }
  };

  // Data hooks
  const { data: tasks = [], isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const taskData = isEditMode ? tasks.find((t) => t.id === id) : undefined;

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
  });

  // Populate form in edit mode once data is available
  useEffect(() => {
    if (isEditMode && taskData) {
      reset({
        title: taskData.title,
        description: taskData.description ?? '',
      });
    }
  }, [isEditMode, taskData, reset]);

  // GSAP entrance animation — scoped to container, reverted on unmount
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.from(headingRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power2.out',
        });
        gsap.from(formRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.1,
        });
      }, containerRef);
    } catch {
      // GSAP unavailable — page still works without animation
    }
    return () => ctx?.revert();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const onSubmit = (data: TaskFormInputs) => {
    if (isEditMode && id) {
      updateTask.mutate(
        { id, title: data.title, description: data.description },
        { onSuccess: () => navigateTo('/dashboard') }
      );
    } else {
      createTask.mutate(
        { title: data.title, description: data.description },
        { onSuccess: () => navigateTo('/dashboard') }
      );
    }
  };

  const handleDelete = () => {
    if (!id) return;
    const confirmed = window.confirm('Yakin ingin menghapus tugas ini?');
    if (!confirmed) return;
    deleteTask.mutate(id, {
      onSuccess: () => navigateTo('/dashboard'),
    });
  };

  const isMutating =
    createTask.isPending || updateTask.isPending || deleteTask.isPending;

  // ── Not-found state (edit mode, data loaded, but task missing) ────────────

  if (isEditMode && !taskData && !isLoading) {
    return (
      <div className="min-h-screen bg-fourty flex flex-col items-center justify-center gap-6 p-8">
        <p className="font-subHeading text-primary text-lg">
          Tugas tidak ditemukan.
        </p>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          ← Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="min-h-screen bg-third">
      {/* Page wrapper with max-width */}
      <div className="main-container py-8 md:py-12">
        {/* ─── Top bar: Back button + Heading ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <button
            onClick={() => navigateTo('/dashboard')}
            className="font-subHeading text-sm text-primary/70 hover:text-primary transition w-fit flex items-center gap-4"
            aria-label="Kembali ke dashboard"
          >
            ← Take Me Back
          </button>

          <h1
            ref={headingRef}
            className="font-heading text-2xl md:text-4xl text-primary uppercase"
          >
            {isEditMode ? 'Edit Task' : 'Create Task'}
          </h1>
        </div>

        {/* ─── Form ─── */}
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          noValidate
        >
          {/* Title field */}
          <Input
            label="Title"
            placeholder="Masukkan judul tugas..."
            error={errors.title?.message}
            {...register('title')}
          />

          {/* Description field — native textarea styled to match Input */}
          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor="task-description"
              className="text-sm font-subHeading text-primary font-medium"
            >
              Description
            </label>
            <textarea
              id="task-description"
              rows={4}
              placeholder="Tambahkan deskripsi tugas..."
              className={[
                'border border-third rounded-2xl px-4 py-2.5 w-full font-subHeading',
                'bg-primary/10 text-primary outline-none transition-all resize-none',
                'focus:border-primary',
                errors.description
                  ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-500 focus:ring-red-500/20'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500 font-subHeading">
                {errors.description.message}
              </p>
            )}
          </div>

          {/*
           * ─── Action buttons ───────────────────────────────────────────────
           * On mobile (<768px): fixed to the bottom of the viewport
           * On desktop (md+): rendered inline below the form
           */}
          <div
            className="
              fixed bottom-0 left-0 right-0
              md:static md:border-0 md:p-0 md:bg-transparent
              flex items-center justify-between gap-3
            "
          >
            {/* Danger: delete (edit mode only) */}
            {isEditMode && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                isLoading={deleteTask.isPending}
                disabled={isMutating}
              >
                Hapus
              </Button>
            )}

            {/* Spacer when no delete button */}
            {!isEditMode && <span />}

            {/* Primary: save */}
            <Button
              type="submit"
              variant="primary"
              isLoading={createTask.isPending || updateTask.isPending}
              disabled={isMutating}
            >
              Simpan
            </Button>
          </div>

          {/*
           * Spacer so the fixed bottom bar on mobile doesn't overlap form content.
           * Hidden on md+ where the bar is static.
           */}
          <div className="h-20 md:hidden" aria-hidden="true" />
        </form>
      </div>
    </div>
  );
};
