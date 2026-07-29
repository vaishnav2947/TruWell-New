// frontend/components/layout/navbar-auth.tsx
import { Link } from 'next/link';
import { Sun, Moon } from 'lucide-react';

export function NavbarAuth() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-xl font-semibold text-primary-600">
                TruWell Pharmacy
              </span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* We don't show any links in the navbar for auth pages */}
          </div>
          <div className="flex items-center">
            {/* Theme toggle */}
            <button
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              title="Toggle theme"
            >
              {/* We'll implement theme toggle later, for now just a placeholder */}
              <Sun className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}