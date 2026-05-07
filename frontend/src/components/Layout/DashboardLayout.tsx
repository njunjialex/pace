import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Rentify</h1>
          <p className="text-sm text-gray-500 mt-1">House Rental Platform</p>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-3">
          {/* We'll add role-specific menu items later */}
        </nav>

        <div className="absolute bottom-6 w-64 px-6">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-600 hover:text-red-700 w-full p-3 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-8 py-4">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;