// frontend/app/(auth)/forgot-password/page.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      router.push('/dashboard');
    }
  }, [router]);

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to process request');
      }

      const result = await res.json();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>
        {success ? (
          <div className="text-center text-green-600 space-y-4">
            <p>If the email exists, a reset link has been sent to your email.</p>
            <Button
              onClick={() => router.push('/auth/login')}
              variant="outline"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              w-full'}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div className="text-center text-sm mt-2">
              <p>Remember your password? <a href="/auth/login" className="text-blue-600 hover:underline">Log in</a></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}