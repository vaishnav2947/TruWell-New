// frontend/components/layout/sidebar-auth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';

export function SidebarAuth() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  // If we accidentally land on an auth page while logged in, clear the auth and redirect to login?
  // But we already have a redirect in the layout to dashboard if logged in.
  // We'll do nothing here.
  return null;
}