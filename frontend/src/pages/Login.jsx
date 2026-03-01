import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, User, Lock, BookOpen, Eye, EyeOff, CheckCircle2, BarChart2, FileText } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">

      {/* Blobs animados de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* ── Columna izquierda: Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative z-10">
        {/* Logo + nombre */}
        <div className="animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl mb-8 border border-white/20">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-3">
            Sistema de<br />Gestión de<br />Tareas
          </h1>
          <p className="text-purple-200 text-lg font-medium mb-1">Comité de Mejora Continua</p>
          <p className="text-purple-300/70 text-sm">Escuela Profesional de Odontología · EPO</p>
        </div>

        {/* Bullets de funcionalidades */}
        <div className="space-y-5 animate-fade-in-up">
          <p className="text-purple-200/80 text-sm uppercase tracking-widest font-semibold mb-6">
            ¿Qué puedes hacer aquí?
          </p>
          {[
            { icon: CheckCircle2, label: 'Gestión de tareas', desc: 'Crea, asigna y completa tareas del comité' },
            { icon: BarChart2,    label: 'Estadísticas',      desc: 'Visualiza el avance y productividad mensual' },
            { icon: FileText,     label: 'Reportes PDF',      desc: 'Descarga informes mensuales con un clic' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-purple-200" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-purple-300/70 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer columna izquierda */}
        <p className="text-purple-300/40 text-xs">
          © 2026 Escuela Profesional de Odontología
        </p>
      </div>

      {/* ── Columna derecha: Formulario ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">

          {/* Logo visible solo en móvil */}
          <div className="text-center mb-8 lg:hidden animate-fade-in-down">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full shadow-2xl mb-4 border border-white/20">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">TareasEpo</h1>
            <p className="text-purple-200 text-sm">Comité de Mejora Continua</p>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
              <p className="text-gray-500 mt-2">Inicia sesión para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  Usuario
                </label>
                <div className="relative transition-all duration-300 focus-within:transform focus-within:scale-[1.02]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-12 py-3 bg-gray-50 border-gray-200 focus:bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Ej: jefa"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  Contraseña
                </label>
                <div className="relative transition-all duration-300 focus-within:transform focus-within:scale-[1.02]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12 pr-12 py-3 bg-gray-50 border-gray-200 focus:bg-white text-gray-900 placeholder-gray-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-500/30 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center relative overflow-hidden group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Iniciando...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center">
                      <LogIn className="w-5 h-5 mr-2" />
                      Iniciar Sesión
                    </span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2 opacity-75 hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <p className="text-xs text-gray-500 text-center font-medium">
                  Sistema Operativo v1.0 · Comité de Mejora Continua EPO
                </p>
              </div>
            </div>
          </div>

          {/* Footer móvil */}
          <p className="text-center text-purple-200/40 text-xs mt-6 lg:hidden">
            © 2026 Escuela Profesional de Odontología
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;