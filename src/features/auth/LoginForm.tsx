import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../../utilities/components/Input';
import { Button } from '../../utilities/components/Button';

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
    setError,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    // Kredensial Pengujian Hardcoded
    if (data.username === 'admin' && data.password === 'password123') {
      login(data.username, 'mock-jwt-token-xyz');
    } else {
      setError('root', { message: 'Kredensial salah! Gunakan admin / password123' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 "
    >
      <Input
        label="Username"
        placeholder="Masukkan username"
        error={errors.username?.message}
        {...register('username')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {errors.root && (
        <p className="text-red-500 text-sm mt-2">{errors.root.message}</p>
      )}

      <Button type="submit" variant="primary" className="mt-2 rounded-2xl py-4 hover:bg-primary/90 transtion duration-300">
        Masuk Aplikasi
      </Button>
    </form>
  );
};
