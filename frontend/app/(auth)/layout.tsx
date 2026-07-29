// frontend/app/(auth)/layout.tsx
import { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import { SidebarAuth } from '@/components/sidebar-auth'; // We'll create a simple sidebar for auth pages, or maybe no sidebar
import { NavbarAuth } from '@/components/navbar-auth'; // We'll create a navbar for auth pages

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  // Check if the user is logged in (by checking the access token in the store)
  // We don't have a direct way to check the access token without causing a flash, but we can check the cookie for the refresh token?
  // We'll do a simple check: if there's an access token in the store, redirect to dashboard.
  // We'll use useEffect to run on client side only.
  useEffect(() => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <>
      <NavbarAuth />
      <div className="flex min-h-screen">
        <SidebarAuth />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
}