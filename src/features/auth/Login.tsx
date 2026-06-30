import { LoginForm } from './LoginForm';

export const Login = () => {
  return (
    <section className="min-h-screen bg-grey-500 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1 text-primary tracking-tight">
          TaskFlow Manager
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Silakan masuk menggunakan akun uji coba
        </p>
        <LoginForm />
      </div>
    </section>
  );
};
