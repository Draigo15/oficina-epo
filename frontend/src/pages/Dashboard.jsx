import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CheckCircle2, Clock, FileText, Plus, AlertCircle, HelpCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, isJefa } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/reports/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">Cargando información...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0 space-y-8">
        {/* Saludo personalizado */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            ¡Hola, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {isJefa() ? 'Aquí está el resumen de todas las tareas' : 'Aquí está el resumen de tu trabajo'}
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/tasks?filter=pendiente" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100 dark:border-gray-700">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-full opacity-50 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8" />
              </div>
              <p className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">{stats?.pendingTasks || 0}</p>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">Tareas Pendientes</p>
              <p className="text-sm mt-2 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Click para ver detalles</p>
            </div>
          </Link>

          <Link to="/tasks?filter=completada" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100 dark:border-gray-700">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full opacity-50 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">{stats?.completedTasks || 0}</p>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">Tareas Completadas</p>
              <p className="text-sm mt-2 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Click para ver detalles</p>
            </div>
          </Link>

          <Link to="/tasks" className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100 dark:border-gray-700">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-50 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">{stats?.totalTasks || 0}</p>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total de Tareas</p>
              <p className="text-sm mt-2 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Click para ver todas</p>
            </div>
          </Link>
        </div>

        {/* Alerta de tareas urgentes */}
        {stats?.highPriorityTasks > 0 && (
          <div className="rounded-2xl p-6 bg-gradient-to-r from-pink-50 to-red-50 dark:from-red-900/20 dark:to-pink-900/20 border border-pink-200 dark:border-red-800 shadow-md animate-pulse-slow">
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex-shrink-0 bg-pink-100 dark:bg-red-900/50 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-pink-600 dark:text-red-400" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-pink-800 dark:text-pink-200">
                  ¡Atención! Tienes {stats.highPriorityTasks} {stats.highPriorityTasks === 1 ? 'tarea urgente' : 'tareas urgentes'}
                </h3>
                <p className="mt-1 text-pink-700 dark:text-pink-300">Es importante atenderlas pronto para mantener el flujo de trabajo.</p>
              </div>
              <Link to="/tasks?priority=high">
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-xl transition-colors shadow-lg shadow-pink-600/30">
                  Ver Tareas Urgentes
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/tasks" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">
                  {isJefa() ? 'Gestionar Tareas' : 'Ver Mis Tareas'}
                </h3>
                <p className="text-purple-100 max-w-xs">
                  {isJefa() ? 'Crear, editar y organizar tareas del equipo' : 'Ver y completar tus tareas asignadas'}
                </p>
              </div>
              <Plus className="w-16 h-16 opacity-80 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </Link>

          <Link to="/reports" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Generar Reporte</h3>
                <p className="text-pink-100 max-w-xs">
                  Descarga el informe mensual en PDF con un solo click
                </p>
              </div>
              <FileText className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>
        </div>

        {/* Guía rápida */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-md border border-gray-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <HelpCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
            ¿Cómo usar el sistema?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Crea o registra tareas',
                desc: `Ve a "Tareas" y haz click en el botón ${isJefa() ? '"Nueva Tarea"' : '"Registrar Tarea"'}`,
                color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300'
              },
              {
                step: 2,
                title: 'Marca como completadas',
                desc: 'Cuando termines una tarea, haz click en el botón verde ✓ para finalizarla.',
                color: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300'
              },
              {
                step: 3,
                title: 'Genera tu reporte',
                desc: 'Ve a "Reportes", selecciona el mes deseado y descarga el PDF automáticamente.',
                color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${item.color}`}>
                  {item.step}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{item.title}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
