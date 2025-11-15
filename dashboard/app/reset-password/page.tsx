import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-white">Reset password</h1>
        <p className="text-sm text-slate-400">
          Enter the email associated with your DocSquare account. We&apos;ll send reset instructions.
        </p>
        <Input type="email" placeholder="Email address" required />
        <button className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950">
          Send reset link
        </button>
        <p className="text-center text-sm text-slate-500">
          Remember the password? <Link href="/signin" className="text-cyan-300">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
