import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ListChecks, FileText, LogOut, Sun, Moon, Menu, X, User } from 'lucide-react';
import Notifications from './Notifications';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tareas', href: '/tasks', icon: ListChecks },
    { name: 'Reportes', href: '/reports', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="shadow-lg border-b border-purple-800/20 sticky top-0 z-50 backdrop-blur-md bg-opacity-90 transition-all duration-300" 
           style={{
             background: theme === 'dark' 
               ? 'linear-gradient(to right, #1f2937, #111827)' 
               : 'linear-gradient(to right, #663399, #7d3eb8)'
           }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center group cursor-pointer">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-white/30 transition-all duration-300">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight group-hover:tracking-wide transition-all duration-300">Oficina Epo</h1>
              </div>
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        active
                          ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                          : 'text-purple-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-2 ${active ? 'animate-pulse' : ''}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/profile" className="flex flex-col items-end text-sm text-white hover:opacity-80 transition-opacity group">
                <div className="flex items-center">
                  <span className="font-bold tracking-wide mr-2">{user?.fullName}</span>
                  <div className="bg-white/10 p-1 rounded-full group-hover:bg-white/20 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-xs text-purple-200 bg-purple-900/30 px-2 py-0.5 rounded-full mt-0.5">
                  {user?.role === 'jefa' ? 'Jefa' : 'Asistente'}
                </span>
              </Link>
              
              <div className="h-8 w-px bg-white/20 mx-2"></div>

              <Notifications />

              <button
                onClick={toggleTheme}
                className="p-2 text-purple-100 hover:text-white rounded-full hover:bg-white/10 transition-all duration-200 hover:rotate-12 transform hover:scale-110"
                title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-red-500/20 hover:text-red-100 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-2">
              <Notifications />
              <button
                onClick={toggleTheme}
                className="p-2 text-purple-100 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-purple-100 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-purple-900/95 backdrop-blur-xl border-t border-purple-700/50">
            <Link 
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-white border-b border-white/10 mb-2 hover:bg-white/10 rounded-md transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{user?.fullName}</p>
                  <p className="text-sm text-purple-200">{user?.role === 'jefa' ? 'Jefa' : 'Asistente'}</p>
                </div>
                <User className="w-5 h-5 text-purple-200" />
              </div>
            </Link>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'text-purple-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-colors mt-2"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
