import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { CheckCircle2, Clock, FileText, Plus, AlertCircle, HelpCircle, AlertTriangle, CalendarClock, CalendarCheck, TrendingUp, Star } from 'lucide-react';

const Dashboard = () => {
  const { user, isJefa } = useAuth();
  const { success, error } = useToast();
  const [stats, setStats] = useState(null);
  const [urgentTasks, setUrgentTasks] = useState(null);
  const [myStats, setMyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchUrgentTasks();
    if (!isJefa()) fetchMyStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/reports/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrgentTasks = async () => {
    try {
      const response = await api.get('/reports/urgent-tasks');
      setUrgentTasks(response.data);
    } catch (err) {
      console.error('Error al cargar tareas urgentes:', err);
    }
  };

  const fetchMyStats = async () => {
    try {
      const response = await api.get('/reports/my-stats');
      setMyStats(response.data);
    } catch (err) {
      console.error('Error al cargar estadísticas personales:', err);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      success('Tarea marcada como completada');
      fetchStats();
      fetchUrgentTasks();
    } catch (err) {
      console.error('Error al completar tarea:', err);
      error('Error al completar la tarea');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short'
    });
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
          <p className="text-sm font-medium text-purple-400 dark:text-purple-500 uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^\w/, c => c.toUpperCase())}
          </p>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            ¡Hola, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            {isJefa() ? 'Aquí está el resumen de todas las tareas del sistema' : `Tu progreso personal de ${myStats?.monthName || 'este mes'}`}
          </p>
        </div>

        {/* Sección de Tareas Urgentes */}
        {urgentTasks && urgentTasks.totalUrgent > 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 shadow-lg border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 dark:bg-red-600 p-3 rounded-full animate-pulse">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-800 dark:text-red-400">
                    ⚠️ Tareas que Requieren Atención
                  </h3>
                  <p className="text-red-600 dark:text-red-300">
                    {urgentTasks.totalUrgent} {urgentTasks.totalUrgent === 1 ? 'tarea necesita' : 'tareas necesitan'} tu atención inmediata
                  </p>
                </div>
              </div>
              <Link to="/tasks">
                <button className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105">
                  Ver Todas
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tareas Vencidas */}
              {urgentTasks.overdue.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-red-300 dark:border-red-700">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h4 className="font-bold text-red-800 dark:text-red-400">VENCIDAS ({urgentTasks.overdue.length})</h4>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {urgentTasks.overdue.map((task) => (
                      <div key={task._id} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{task.title}</p>
                        <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                          🔴 Venció hace {Math.max(1, Math.round((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24)))} {Math.max(1, Math.round((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24))) === 1 ? 'día' : 'días'}
                        </p>
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 rounded-md transition-colors"
                        >
                          ✓ Completar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tareas de Hoy */}
              {urgentTasks.today.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-orange-300 dark:border-orange-700">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarClock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h4 className="font-bold text-orange-800 dark:text-orange-400">HOY ({urgentTasks.today.length})</h4>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {urgentTasks.today.map((task) => (
                      <div key={task._id} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{task.title}</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                          🚨 ¡Vence HOY! · {task.priority === 'alta' ? 'Urgente' : 'Normal'}
                        </p>
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-1.5 rounded-md transition-colors"
                        >
                          ✓ Completar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tareas de Mañana */}
              {urgentTasks.tomorrow.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-yellow-300 dark:border-yellow-700">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-400">MAÑANA ({urgentTasks.tomorrow.length})</h4>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {urgentTasks.tomorrow.map((task) => (
                      <div key={task._id} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{task.title}</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                          ⏰ Vence mañana · {task.priority === 'alta' ? 'Urgente' : 'Normal'}
                        </p>
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          className="mt-2 w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1.5 rounded-md transition-colors"
                        >
                          ✓ Completar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Barra de progreso personal - solo asistente */}
        {!isJefa() && myStats && (
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md border-2 border-purple-100 dark:border-purple-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Mi progreso de {myStats.monthName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {myStats.myCompletedMonth} de {myStats.totalThisMonth} tareas completadas este mes
                </p>
              </div>
              <span className={`text-3xl font-bold ${
                myStats.progressPercent >= 70 ? 'text-green-600 dark:text-green-400'
                : myStats.progressPercent >= 40 ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-500 dark:text-red-400'
              }`}>
                {myStats.progressPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-5 overflow-hidden">
              <div
                className={`h-5 rounded-full transition-all duration-1000 ${
                  myStats.progressPercent >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                  : myStats.progressPercent >= 40 ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                  : 'bg-gradient-to-r from-red-400 to-orange-500'
                }`}
                style={{ width: `${myStats.progressPercent}%` }}
              ></div>
            </div>
            <p className={`mt-3 text-sm font-semibold ${
              myStats.progressPercent >= 70 ? 'text-green-600 dark:text-green-400'
              : myStats.progressPercent >= 40 ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-500 dark:text-red-400'
            }`}>
              {myStats.progressPercent >= 90 ? '🏆 ¡Increíble desempeño! Casi al 100% este mes'
                : myStats.progressPercent >= 70 ? '⭐ ¡Excelente! Vas muy bien este mes'
                : myStats.progressPercent >= 40 ? '💪 ¡Buen ritmo! Sigue adelante'
                : myStats.totalThisMonth === 0 ? '📋 Aún no hay tareas registradas este mes'
                : '🎯 Quedan tareas pendientes — ¡tú puedes completarlas!'}
            </p>
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isJefa() ? (
            <>
              <Link to="/tasks?filter=pendiente" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-8 h-8" />
                  </div>
                  <p className="text-5xl font-bold mb-2 text-white">{stats?.pendingTasks || 0}</p>
                  <p className="text-lg font-semibold text-purple-100">Pendientes</p>
                </div>
              </Link>
              <Link to="/tasks?filter=completada" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="text-5xl font-bold mb-2 text-white">{stats?.completedTasks || 0}</p>
                  <p className="text-lg font-semibold text-green-100">Completadas</p>
                </div>
              </Link>
              <Link to="/tasks" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <p className="text-5xl font-bold mb-2 text-white">{stats?.overdueTasks || 0}</p>
                  <p className="text-lg font-semibold text-red-100">Vencidas</p>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link to="/tasks?filter=pendiente" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-8 h-8" />
                  </div>
                  <p className="text-5xl font-bold mb-2 text-white">{myStats?.myPending || 0}</p>
                  <p className="text-lg font-semibold text-purple-100">Mis Pendientes</p>
                </div>
              </Link>
              <Link to="/tasks?filter=completada" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="text-5xl font-bold mb-2 text-white">{myStats?.myCompletedTotal || 0}</p>
                  <p className="text-lg font-semibold text-green-100">Completadas por Mí</p>
                </div>
              </Link>
              <Link to="/tasks" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white rounded-full opacity-20 blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <p className="text-5xl font-bold mb-2 text-white">{myStats?.myOverdue || 0}</p>
                  <p className="text-lg font-semibold text-red-100">Mis Vencidas</p>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Alerta alta prioridad - solo jefa */}
        {isJefa() && stats?.highPriorityTasks > 0 && (
          <div className="rounded-2xl p-6 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 shadow-lg">
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex-shrink-0 bg-red-500 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-red-800">
                  ¡Atención! Hay {stats.highPriorityTasks} {stats.highPriorityTasks === 1 ? 'tarea urgente' : 'tareas urgentes'} en el sistema
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

        {/* Mensaje motivacional - solo asistente */}
        {!isJefa() && myStats && (
          <div className="rounded-2xl p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex-shrink-0 bg-purple-500 dark:bg-purple-600 p-3 rounded-full">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">
                  {myStats.myCompletedTotal === 0
                    ? '¡Bienvenida al sistema!'
                    : `¡Llevas ${myStats.myCompletedTotal} ${myStats.myCompletedTotal === 1 ? 'tarea completada' : 'tareas completadas'} en total!`}
                </h3>
                <p className="mt-1 text-purple-700 dark:text-purple-400">
                  {myStats.myCompletedMonth > 0
                    ? `Este mes completaste ${myStats.myCompletedMonth} ${myStats.myCompletedMonth === 1 ? 'tarea' : 'tareas'}. ¡Sigue con ese ritmo!`
                    : 'Completa tus primeras tareas de este mes para ver tu progreso aquí.'}
                </p>
              </div>
              <Link to="/tasks">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-colors shadow-lg">
                  Ver Mis Tareas
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
