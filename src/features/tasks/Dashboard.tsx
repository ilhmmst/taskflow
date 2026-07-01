import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAuthStore } from '../../store/useAuthStore';
import { useTaskFilterStore } from '../../store/useTaskFilterStore';
import {
  useTasks,
  useToggleTaskStatus,
  useDeleteTask,
  useBulkDeleteTasks,
  useBulkCompleteTasks,
} from '../../hooks/useTasks';
import { usePageTransition } from '../../hooks/usePageTransition';
import { TaskCard } from './TaskCard';
import { Button } from '../../utilities/components/Button';
import { LogOut, Search, Plus } from 'lucide-react';

export const Dashboard = () => {
  const { pageRef, navigateTo } = usePageTransition();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter } =
    useTaskFilterStore();
  const { data: tasks = [], isLoading } = useTasks();

  const toggleStatus = useToggleTaskStatus();
  const deleteTask = useDeleteTask();
  const bulkDelete = useBulkDeleteTasks();
  const bulkComplete = useBulkCompleteTasks();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── Filter & Search ────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase() ?? '').includes(
        searchQuery.toLowerCase()
      );

    if (statusFilter === 'COMPLETED') return matchesSearch && task.completed;
    if (statusFilter === 'PENDING') return matchesSearch && !task.completed;
    return matchesSearch;
  });

  const isAllSelected =
    filteredTasks.length > 0 &&
    filteredTasks.every((t) => selectedIds.includes(t.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredTasks.some((t) => t.id === id))
      );
    } else {
      const newIds = filteredTasks.map((t) => t.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...newIds])));
    }
  };

  const handleSelectTask = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEditTask = (id: string) => {
    navigateTo(`/tasks/${id}/edit`);
  };

  // ── GSAP staggered entrance ────────────────────────────────────────────────
  const previousTaskCount = useRef<number>(0);

  useEffect(() => {
    if (isLoading || filteredTasks.length === 0) {
      return;
    }

    const prevCount = previousTaskCount.current;
    const currentCount = filteredTasks.length;

    try {
      if (prevCount === 0) {
        // Initial load — stagger all cards
        gsap.fromTo(
          '.task-card',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' }
        );
      } else if (currentCount > prevCount) {
        // New card(s) added — animate only the newly added cards
        const newCardCount = currentCount - prevCount;
        const allCards = document.querySelectorAll('.task-card');
        // New tasks are prepended (createdAt desc), so they appear at the start of the grid
        const newCards = Array.from(allCards).slice(0, newCardCount);
        if (newCards.length > 0) {
          gsap.fromTo(
            newCards,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' }
          );
        }
      }
    } catch {
      // GSAP not available or selector empty — fail silently
    }

    previousTaskCount.current = currentCount;

    return () => {
      try {
        gsap.killTweensOf('.task-card');
      } catch {
        // fail silently
      }
    };
  }, [isLoading, filteredTasks.length]);

  // ── Derived empty-state flags ──────────────────────────────────────────────
  const hasNoTasksAtAll = !isLoading && tasks.length === 0;
  const hasNoMatchingTasks =
    !isLoading && tasks.length > 0 && filteredTasks.length === 0;

  return (
    <div ref={pageRef} className="min-h-screen text-primary font-subHeading">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-third sticky top-0 z-10 px-27 py-4 flex justify-between items-center border-b-2 ">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl">
            DASHBOARD
          </h1>
          <span className="font-subHeading text-sm">
            Hello,{' '}
            <strong className="font-semibold">
              {user?.username}
            </strong>
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center bg-primary gap-1.5 text-secondary hover:text-secondary/70 font-subHeading text-sm transition px-4 py-2 rounded-lg hover:bg-primary/90 cursor-pointer"
          aria-label="Keluar"
        >
          LogOut
          <LogOut size={15} />
        </button>
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="main-container py-6 px-4 md:px-6">

        {/* ── Top row: Search + New Task button ──────────────────────────── */}
        <div className="grid grid-cols-5 gap-4 mb-6">

          {/* Search pill */}
          <div className="col-span-3 relative flex items-center rounded-lg border border-third bg-fourty px-4 py-2 gap-2">
            <input
              type="text"
              placeholder="Search Task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none font-subHeading text-sm text-primary placeholder:text-primary/40"
              aria-label="Cari tugas"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="cursor-pointer text-primary/40 hover:text-primary transition text-base leading-none"
                aria-label="Hapus pencarian"
              >
                ×
              </button>
            )}
            <button
              aria-label="Cari"
              className="cursor-pointer text-primary/50 hover:text-primary transition"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Buat Tugas Baru */}
          <Button
            variant="primary"
            size="md"
            onClick={() => navigateTo('/tasks/new')}
            className="col-span-2 uppercase flex items-center gap-2 rounded-lg font-heading text-xs tracking-widest"
          >
            <Plus size={15} />
            Add Task
            <Plus size={15} />

          </Button>
        </div>

        {/* ── Status filter tabs ──────────────────────────────────────────── */}
        <div className="flex bg-primary/10 p-1 rounded-lg border border-third/40 w-fit mb-6">
          {(['ALL', 'PENDING', 'COMPLETED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`cursor-pointer px-4 py-1.5 rounded-md font-subHeading text-xs font-semibold tracking-wide transition ${statusFilter === filter
                  ? 'bg-primary text-secondary'
                  : 'text-primary/50 hover:text-primary'
                }`}
            >
              {filter === 'ALL'
                ? 'Semua'
                : filter === 'PENDING'
                  ? 'Belum Selesai'
                  : 'Selesai'}
            </button>
          ))}
        </div>

        {/* ── Bulk toolbar ────────────────────────────────────────────────── */}
        {selectedIds.length > 0 && (
          <div className="border-1 border-secondary bg-secondary/20 p-3 rounded-lg mb-4 flex justify-between items-center transition-all duration-200">
            <div className="flex items-center gap-3 pl-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 cursor-pointer accent-secondary rounded"
                aria-label="Pilih semua tugas"
              />
              <span className="font-subHeading text-sm font-semibold text-primary">
                {selectedIds.length} Tugas dipilih
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  bulkComplete.mutate(selectedIds, {
                    onSuccess: () => setSelectedIds([]),
                  })
                }
                isLoading={bulkComplete.isPending}
              >
                Tandai Selesai
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  bulkDelete.mutate(selectedIds, {
                    onSuccess: () => setSelectedIds([]),
                  })
                }
                isLoading={bulkDelete.isPending}
              >
                Hapus Sekaligus
              </Button>
            </div>
          </div>
        )}

        {/* ── Card grid ───────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-third/40 rounded-xl p-5 animate-pulse"
              >
                <div className="h-4 bg-third rounded w-3/4 mb-3" />
                <div className="h-3 bg-third rounded w-1/2 mb-6" />
                <div className="h-8 bg-third rounded" />
              </div>
            ))}
          </div>
        ) : hasNoTasksAtAll ? (
          <div className="flex flex-col items-center justify-center py-50 gap-4 text-center">
            <p className="font-subHeading text-primary text-sm">
              Belum ada tugas. Buat tugas pertamamu!
            </p>
            {/* <Button
              variant="secondary"
              size="md"
              onClick={() => navigateTo('/tasks/new')}
              className="rounded-full font-heading text-xs tracking-widest"
            >
              <Plus size={14} className="mr-1" />
              BUAT TUGAS
            </Button> */}
          </div>
        ) : hasNoMatchingTasks ? (
          <div className="flex flex-col items-center justify-center py-50 gap-4 text-center">
            <p className="font-subHeading text-primary text-sm">
              Tidak ada tugas yang cocok.
            </p>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="rounded-full text-xs"
            >
              Hapus Pencarian
            </Button> */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={selectedIds.includes(task.id)}
                onSelect={handleSelectTask}
                onToggle={(id) => toggleStatus.mutate(id)}
                onEdit={(id) => handleEditTask(id)}
                onDelete={(id) => deleteTask.mutate(id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
