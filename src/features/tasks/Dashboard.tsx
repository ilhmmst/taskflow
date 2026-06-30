import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTaskFilterStore } from '../../store/useTaskFilterStore';
import {
  useTasks,
  useToggleTaskStatus,
  useDeleteTask,
  useUpdateTask,
  useBulkDeleteTasks,
  useBulkCompleteTasks,
} from '../../hooks/useTasks';
import { TaskForm } from './TaskForm';
import { EditTaskModal } from './EditTaskModal';
import { LogOut, Trash2, CircleCheck as CheckCircle, Circle, Search, Pencil } from 'lucide-react';

export const Dashboard = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter } =
    useTaskFilterStore();
  const { data: tasks = [], isLoading } = useTasks();

  const toggleStatus = useToggleTaskStatus();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const bulkDelete = useBulkDeleteTasks();
  const bulkComplete = useBulkCompleteTasks();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Logika Filter & Search
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(
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

  const handleEditTask = (task: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
  }) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (data: {
    id: string;
    title: string;
    description?: string;
  }) => {
    updateTask.mutate(data, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setEditingTask(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600 tracking-wide">
          TaskFlow Manager
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            Halo,{' '}
            <strong className="text-gray-950 font-semibold">
              {user?.username}
            </strong>
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-700 font-semibold text-sm transition py-1 px-2 rounded-lg hover:bg-red-50"
          >
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <TaskForm />

        {/* Kontrol Pencarian & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200/60">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau catatan tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200/40">
            {(['ALL', 'PENDING', 'COMPLETED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition ${
                  statusFilter === filter
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
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
        </div>

        {/* Bilah Aksi Massal (Bulk Toolbar) */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50/80 border border-blue-200/70 p-3 rounded-xl mb-4 flex justify-between items-center transition-all duration-200">
            <span className="text-sm font-semibold text-blue-800 pl-2">
              {selectedIds.length} tugas dipilih
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  bulkComplete.mutate(selectedIds, {
                    onSuccess: () => setSelectedIds([]),
                  })
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                Tandai Selesai
              </button>
              <button
                onClick={() =>
                  bulkDelete.mutate(selectedIds, {
                    onSuccess: () => setSelectedIds([]),
                  })
                }
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                Hapus Sekaligus
              </button>
            </div>
          </div>
        )}

        {/* Tabel / Kontainer Daftar Tugas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500 font-medium text-sm animate-pulse">
              Menghubungkan ke Mock API data layer...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm font-medium">
              Tidak ada tugas dalam daftar ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer transition"
                      />
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Rincian Tugas
                    </th>
                    <th className="p-4 w-24 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className={`hover:bg-gray-50/60 transition-colors ${
                        task.completed ? 'bg-gray-50/30' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer transition"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleStatus.mutate(task.id)}
                            className="mt-0.5 text-gray-300 hover:text-blue-600 transition"
                          >
                            {task.completed ? (
                              <CheckCircle
                                className="text-emerald-500"
                                size={19}
                              />
                            ) : (
                              <Circle size={19} />
                            )}
                          </button>
                          <div>
                            <p
                              className={`font-semibold ${
                                task.completed
                                  ? 'line-through text-gray-400 font-normal'
                                  : 'text-gray-800'
                              }`}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p
                                className={`text-xs mt-0.5 ${
                                  task.completed
                                    ? 'line-through text-gray-300'
                                    : 'text-gray-500'
                                }`}
                              >
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="text-gray-400 hover:text-blue-500 p-1.5 rounded-lg hover:bg-gray-100 transition"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => deleteTask.mutate(task.id)}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100 transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <EditTaskModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveEdit}
        isLoading={updateTask.isPending}
      />
    </div>
  );
};
