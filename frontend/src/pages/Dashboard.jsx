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
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-8 shadow-md border border-purple-200 dark:border-purple-800">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            ¡Hola, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            {isJefa() ? 'Aquí está el resumen de todas las tareas' : 'Aquí está el resumen de tu trabajo'}
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/tasks?filter=pendiente" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8" />
              </div>
              <p className="text-5xl font-bold mb-2 text-white">{stats?.pendingTasks || 0}</p>
              <p className="text-lg font-semibold text-purple-100">Tareas Pendientes</p>
            </div>
          </Link>

          <Link to="/tasks?filter=completada" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-5xl font-bold mb-2 text-white">{stats?.completedTasks || 0}</p>
              <p className="text-lg font-semibold text-green-100">Tareas Completadas</p>
            </div>
          </Link>

          <Link to="/tasks" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-5xl font-bold mb-2 text-white">{stats?.totalTasks || 0}</p>
              <p className="text-lg font-semibold text-blue-100">Total de Tareas</p>
            </div>
          </Link>
        </div>

        {/* Alerta de tareas urgentes */}
        {stats?.highPriorityTasks > 0 && (
          <div className="rounded-2xl p-6 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 shadow-lg">
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex-shrink-0 bg-red-500 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-red-800">
                  ¡Atención! Tienes {stats.highPriorityTasks} {stats.highPriorityTasks === 1 ? 'tarea urgente' : 'tareas urgentes'}
                </h3>
                <p className="mt-1 text-red-700">Es importante atenderlas pronto para mantener el flujo de trabajo.</p>
              </div>
              <Link to="/tasks?priority=high">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition-colors shadow-lg">
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
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-md border-2 border-gray-200 dark:border-gray-700">
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
                color: 'bg-purple-500 text-white'
              },
              {
                step: 2,
                title: 'Marca como completadas',
                desc: 'Cuando termines una tarea, haz click en el botón verde ✓ para finalizarla.',
                color: 'bg-green-500 text-white'
              },
              {
                step: 3,
                title: 'Genera tu reporte',
                desc: 'Ve a "Reportes", selecciona el mes deseado y descarga el PDF automáticamente.',
                color: 'bg-blue-500 text-white'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${item.color} shadow-lg`}>
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
