import axios from 'axios';

// Definisi interface Task agar tipe data di storage konsisten
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

// Simulasi Latensi (800ms - 1s) [cite: 22]
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = axios.create({
  baseURL: 'mock-api',
});

// Interceptor untuk simulasi token & latensi [cite: 22, 36]
mockApi.interceptors.request.use(async (config) => {
  await delay(Math.floor(Math.random() * 200) + 800);

  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Abstraksi Lapisan Data (LocalStorage) [cite: 12, 34]
export const storage = {
  // Read
  getTasks: (): Task[] => {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  },

  // Create / Save All
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  },

  // ==========================================
  // TAMBAHAN BARU: UPDATE TASK (Satu data)
  // ==========================================
  updateTask: (id: string, updatedFields: Partial<Task>): Task[] => {
    const tasks = storage.getTasks();
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updatedFields } : task
    );
    storage.saveTasks(updatedTasks);
    return updatedTasks;
  },

  // ==========================================
  // TAMBAHAN BARU: DELETE TASK (Satu data)
  // ==========================================
  deleteTask: (id: string): Task[] => {
    const tasks = storage.getTasks();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    storage.saveTasks(filteredTasks);
    return filteredTasks;
  },

  // ==========================================
  // TAMBAHAN BONUS: BULK ACTIONS (Aksi Massal)
  // ==========================================
  bulkDelete: (ids: string[]): Task[] => {
    const tasks = storage.getTasks();
    const filteredTasks = tasks.filter((task) => !ids.includes(task.id));
    storage.saveTasks(filteredTasks);
    return filteredTasks;
  },

  bulkComplete: (ids: string[]): Task[] => {
    const tasks = storage.getTasks();
    const updatedTasks = tasks.map((task) =>
      ids.includes(task.id) ? { ...task, completed: true } : task
    );
    storage.saveTasks(updatedTasks);
    return updatedTasks;
  },
};
