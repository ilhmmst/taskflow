import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/useAuthStore';

const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    // Kredensial Pengujian Hardcoded
    if (data.username === 'admin' && data.password === 'password123') {
      login(data.username, 'mock-jwt-token-xyz');
    } else {
      alert('Kredensial salah! Gunakan admin / password123');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 p-6 bg-white shadow-xl rounded-xl border border-gray-100"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Username
        </label>
        <input
          {...register('username')}
          placeholder="Masukkan username"
          className="border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.username && (
          <span className="text-red-500 text-xs mt-0.5">
            {errors.username.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Password
        </label>
        <input
          type="password"
          {...register('password')}
          placeholder="••••••••"
          className="border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.password && (
          <span className="text-red-500 text-xs mt-0.5">
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white font-medium p-2.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition shadow-md shadow-blue-200 mt-2 cursor-pointer"
      >
        Masuk Aplikasi
      </button>
    </form>
  );
};
