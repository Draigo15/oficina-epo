import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, User, Lock, BookOpen, Eye, EyeOff, CheckCircle2, BarChart2, FileText } from 'lucide-react';

const Login = () => {
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const { login }                       = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate                        = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(username, password);
    if (result.success) {
      const userName = result.user?.fullName || username;
      toastSuccess(`¡Bienvenido de nuevo, ${userName}!`);
      navigate('/dashboard');
    } else {
      toastError(result.message || 'Error al iniciar sesión');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 p-6 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full max-w-4xl min-h-[520px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        <div className="md:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 p-10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 rounded-2xl mb-8 border border-white/20">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-snug mb-3">
              Sistema de<br />Gestión de<br />Tareas
            </h1>
            <p className="text-purple-200 text-sm font-semibold mb-1">Comité de Mejora Continua</p>
            <p className="text-purple-300/60 text-xs">Escuela Profesional de Odontología · EPO</p>
          </div>

          <div className="mt-10 space-y-4">
            {[
              { icon: CheckCircle2, label: 'Gestión de tareas', desc: 'Crea y completa tareas del comité' },
              { icon: BarChart2,    label: 'Estadísticas',      desc: 'Visualiza el avance mensual' },
              { icon: FileText,     label: 'Reportes PDF',      desc: 'Descarga informes con un clic' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-xs">{label}</p>
                  <p className="text-purple-300/60 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-purple-300/30 text-xs mt-8">© 2026 Escuela Profesional de Odontología</p>
        </div>

        <div className="md:w-1/2 bg-white flex flex-col items-center justify-center px-10 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
            <p className="text-gray-400 text-sm mb-10">Inicia sesión para gestionar tus tareas</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="Tu nombre de usuario"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition text-gray-900 placeholder-gray-400 text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span>Iniciando...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-10 opacity-60">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xs text-gray-400 font-medium">Sistema Operativo v1.0 · Comité EPO</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -50px) scale(1.1); }
          66%  { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Login;
