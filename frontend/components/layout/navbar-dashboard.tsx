// frontend/components/layout/navbar-dashboard.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/button';
import { DropdownMenu } from '@/components/dropdown-menu'; // We'll create this component
import { Avatar } from '@/components/avatar'; // We'll create this component
import { Badge } from '@/components/badge'; // We'll create this component

export function NavbarDashboard() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const { user } = useAuthStore.getState();

  const handleLogout = () => {
    // Clear the auth store
    clearAuth();
    // Remove the refresh token cookie
    // We'll use js-cookie to remove the cookie
    // We'll import Cookies from 'js-cookie'
    const Cookies = require('js-cookie');
    Cookies.remove('refresh_token', { path: '/api/auth/refresh' });
    // Redirect to login
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white border-b">
      <div className="flex w-items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex items-center">
          <a href="/dashboard">
            <span className="text-xl font-semibold text-primary-600">
              TruWell Pharmacy
            </span>
          </a>
        </div>
        <div className="hidden md:flex md:items-center md:space-x-4">
          {/* We can add navigation links here if needed, but we have a sidebar */}
        </div>
        <div className="flex items-center space-x-4">
          {/* Notification Badge */}
          <div className="relative">
            <Button variant="icon" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            {/* Badge for unread count */}
            <Badge
              className="-mt-1.5 -mr-1.5"
              variant="secondary"
              content="5" // We'll get this from a notification count later
            />
          </div>
          {/* User Menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 rounded-full bg-gray-100 p-1"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
              <span className="hidden md:block">
                {user?.firstName}
              </span>
            </button>
            {/* Dropdown menu for user */}
            <DropdownMenu>
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}