// frontend/components/layout/sidebar-dashboard.tsx
import { Link } from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Activity, Users, LayoutDashboard, Menu } from 'lucide-react';

export function SidebarDashboard() {
  const router = useRouter();
  const { user } = useAuthStore.getState();

  // We can show different menu items based on role
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'PHARMACY_OWNER';

  return (
    <aside className="hidden w-64 bg-primary-900 text-white md:block">
      <div className="flex items-center h-16 px-4 bg-primary-800">
        <div className="flex-shrink-0">
          <span className="text-xl font-semibold">TruWell</span>
        </div>
        <button
          className="ml-auto p-2 rounded-md text-white hover:bg-primary-700"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <nav className="mt-4 space-y-2 px-3">
        <Link
          href="/dashboard"
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            router.asPath === '/dashboard'
              ? 'bg-primary-700'
              : 'hover:bg-primary-800'
          }`}
        >
          <Dashboard className="mr-3 h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/patients"
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            router.asPath.startsWith('/patients')
              ? 'bg-primary-700'
              : 'hover:bg-primary-800'
          }`}
        >
          <Users className="mr-3 h-4 w-4" />
          <span>Patients</span>
        </Link>
        {/*
        // We'll add more links as we implement more modules
        <Link
          href="/consultations"
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            router.asPath.startsWith('/consultations')
              ? 'bg-primary-700'
              : 'hover:bg-primary-800'
          }`}
        >
          <ClipboardList className="mr-3 h-4 w-4" />
          <span>Consultations</span>
        </Link>
        <Link
          href="/prescriptions"
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            router.asPath.startsWith('/prescriptions')
              ? 'bg-primary-700'
              : 'hover:bg-primary-800'
          }`}
        >
          <FileText className="mr-3 h-4 w-4" />
          <span>Prescriptions</span>
        </Link>
        */}
        {isAdmin && (
          <div className="pt-4 pt-3">
            <h2 className="text-xs font-medium text-primary-400">Settings</h2>
            <nav className="mt-1 space-y-1">
              <Link
                href="/settings"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-800"
              >
                <Sliders className="mr-3 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        )}
      </nav>
    </aside>
  );
}