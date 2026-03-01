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
    <div className="min-h-screen flex overflow-hidden">

      {/* Blobs animados */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* ── Panel izquierdo: fondo morado, contenido centrado ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative">
        {/* Contenido centrado absoluto */}
        <div className="absolute inset-0 flex flex-col items-start justify-center px-16 animate-fade-in-down">

          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl mb-8 border border-white/20">
            <BookOpen className="w-8 h-8 text-white" />
          </div>

          {/* Título grande */}
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
            Sistema de<br />Gestión de<br />Tareas
          </h1>

          {/* Subtítulos */}
          <p className="text-purple-200 text-base font-semibold mb-1">Comité de Mejora Continua</p>
          <p className="text-purple-300/60 text-sm mb-10">Escuela Profesional de Odontología · EPO</p>

          {/* Divisor */}
          <div className="w-12 h-0.5 bg-white/25 rounded-full mb-10"></div>

          {/* Bullets */}
          <div className="space-y-5">
            {[
              { icon: CheckCircle2, label: 'Gestión de tareas', desc: 'Crea, asigna y completa tareas del comité' },
              { icon: BarChart2,    label: 'Estadísticas',      desc: 'Visualiza el avance y productividad mensual' },
              { icon: FileText,     label: 'Reportes PDF',      desc: 'Descarga informes mensuales con un clic' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-purple-300/60 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-purple-300/30 text-xs absolute bottom-8 left-16">
            © 2026 Escuela Profesional de Odontología
          </p>
        </div>
      </div>

      {/* ── Panel derecho: blanco, formulario centrado ── */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center px-10 py-12 relative z-10">

        {/* Logo solo en móvil */}
        <div className="text-center mb-10 lg:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">TareasEpo</h1>
          <p className="text-gray-500 text-sm">Comité de Mejora Continua</p>
        </div>

        {/* Formulario */}
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
          <p className="text-gray-400 text-sm mb-10">Inicia sesión para gestionar tus tareas</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Usuario */}
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
                  placeholder="Ej: jefa"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
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

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Estado del sistema */}
          <div className="flex items-center justify-center gap-2 mt-10 opacity-60">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-gray-400 font-medium">Sistema Operativo v1.0 · Comité EPO</p>
          </div>
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
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
