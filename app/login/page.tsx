import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-stone-50">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-orange-700 mb-2">
            Luci
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-stone-900">
            Bom dia, Felipe.
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Entra com seu e-mail. Te mandamos um link.
          </p>
        </div>
        <LoginForm />
        <p className="mt-8 text-center text-xs text-stone-500">
          Só você tem acesso a esse plano.
        </p>
      </div>
    </main>
  );
}
