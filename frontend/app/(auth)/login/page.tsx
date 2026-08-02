"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/stores/auth.store';
import Cookies from 'js-cookie';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';

export default function LoginPage() {
  const router = useRouter();
  const { setAccessToken, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { accessToken, refreshToken, user } = await res.json();

      // Set the access token and user in the store
      setAccessToken(accessToken);
      setUser(user);

      // Set the refresh token in a cookie
      Cookies.set('refresh_token', refreshToken, {
        expires: 7, // 7 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        path: '/api/auth/refresh', // Only send to the refresh endpoint
      });

      // The useEffect above will redirect to dashboard because accessToken is now set
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
          Welcome to TruWell Pharmacy
        </h2>
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div className="text-center text-sm">
            <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}