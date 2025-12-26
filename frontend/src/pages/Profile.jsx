import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Lock, Save, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, isJefa, isAsistente } = useAuth();
  const { success, error: toastError } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      toastError('Las contraseñas no coinciden');
      return;
    }

    if (password && password.length < 6) {
      toastError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const data = {
      fullName
    };

    if (password) {
      data.password = password;
    }

    const result = await updateProfile(data);

    if (result.success) {
      success('Perfil actualizado correctamente');
      setPassword('');
      setConfirmPassword('');
    } else {
      toastError(result.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0 max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-xl mr-4">
            <User className="w-8 h-8 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h2>
            <p className="text-gray-500 dark:text-gray-400">Gestiona tu información personal y seguridad</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Información Personal */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-500" />
                Información Personal
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rol
                  </label>
                  <div className={`px-4 py-2 rounded-xl border ${isJefa() ? 'border-purple-200 bg-purple-50 text-purple-700 dark:text-purple-300 dark:bg-purple-900/20' : 'border-blue-200 bg-blue-50 text-blue-700 dark:text-blue-300 dark:bg-blue-900/20'} dark:border-gray-700 flex items-center`}>
                    {isJefa() && (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        <span className="font-medium">Jefa</span>
                      </>
                    )}
                    {isAsistente() && (
                      <>
                        <User className="w-4 h-4 mr-2" />
                        <span className="font-medium">Asistente</span>
                      </>
                    )}
                    {!isJefa() && !isAsistente() && (
                       <span className="font-medium capitalize">{user?.role}</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">El rol no se puede modificar</p>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100 dark:border-gray-700"></div>

            {/* Seguridad */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-500" />
                Seguridad
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl mb-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-200 flex items-start">
                    <Lock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    Deja los campos de contraseña en blanco si no deseas cambiarla.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 transition-all duration-200 flex items-center font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
