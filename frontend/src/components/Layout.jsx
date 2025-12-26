import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ListChecks, FileText, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tareas', href: '/tasks', icon: ListChecks },
    { name: 'Reportes', href: '/reports', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="shadow-sm border-b" style={{background: 'linear-gradient(to right, #663399, #7d3eb8)', borderBottomColor: '#552288'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-white">Oficina Epo</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-white">
                <span className="font-medium">{user?.fullName}</span>
                <span className="ml-2 text-purple-200">
                  ({user?.role === 'jefa' ? 'Jefa' : 'Asistente'})
                </span>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-2 text-purple-100 hover:text-white rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
                title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
