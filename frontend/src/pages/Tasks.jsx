import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { Plus, Check, X, AlertCircle, Clock, Trash2, RotateCcw, Calendar as CalendarIcon, List, Search, Tag } from 'lucide-react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

// Configurar idioma español para el calendario
moment.locale('es');
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const Tasks = () => {
  const { isJefa } = useAuth();
  const { success, error: toastError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [filter, setFilter] = useState('all'); // all, pendiente, completada
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    category: 'otros',
    scheduledDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      toastError('Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      setFormData({ 
        title: '', 
        description: '', 
        priority: 'normal',
        category: 'otros',
        scheduledDate: new Date().toISOString().split('T')[0]
      });
      setShowModal(false);
      fetchTasks();
      success('Tarea creada exitosamente');
    } catch (error) {
      console.error('Error al crear tarea:', error);
      toastError('Error al crear la tarea');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchTasks();
      success('Tarea marcada como completada');
    } catch (error) {
      console.error('Error al completar tarea:', error);
      toastError('Error al completar la tarea');
    }
  };

  const handleReopenTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/reopen`);
      fetchTasks();
      success('Tarea reabierta correctamente');
    } catch (error) {
      console.error('Error al reabrir tarea:', error);
      toastError('Error al reabrir la tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
      success('Tarea eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      toastError('Error al eliminar la tarea');
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    try {
      // Actualizar visualmente primero (optimistic update)
      const updatedTasks = tasks.map(t => {
        if (t._id === event.id) {
          return { ...t, createdAt: start };
        }
        return t;
      });
      setTasks(updatedTasks);

      console.log('Tarea movida a:', start);
      
      // Implementación real del backend para reprogramar
      await api.patch(`/tasks/${event.id}/reschedule`, { scheduledDate: start });
      success('Tarea reprogramada correctamente');
      
    } catch (error) {
      console.error('Error al mover tarea:', error);
      fetchTasks(); // Revertir cambios si falla
      toastError('Error al reprogramar la tarea');
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#8b5cf6'; // Default morado (violet-500)
    let borderColor = '#7c3aed';
    
    if (event.resource.status === 'completada') {
      backgroundColor = '#10B981'; // Verde (emerald-500)
      borderColor = '#059669';
    } else if (event.resource.priority === 'alta') {
      backgroundColor = '#EF4444'; // Rojo (red-500)
      borderColor = '#DC2626';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '1px solid',
        display: 'block',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontWeight: '500'
      }
    };
  };

  // Convertir tareas a eventos de calendario
  const calendarEvents = tasks.map(task => ({
    id: task._id,
    title: task.title,
    start: new Date(task.scheduledDate || task.createdAt),
    end: new Date(task.scheduledDate || task.createdAt),
    allDay: true,
    resource: task
  }));

  const filteredTasks = tasks.filter(task => {
    // Filtrar por estado
    if (filter !== 'all' && task.status !== filter) return false;
    
    // Filtrar por búsqueda (título o descripción)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(term);
      const descMatch = task.description?.toLowerCase().includes(term);
      return titleMatch || descMatch;
    }
    
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
            <Check className="w-3 h-3 mr-1" /> Completada
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Pendiente
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (category) => {
    const categories = {
      administrativo: { label: 'Administrativo', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
      soporte: { label: 'Soporte', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' },
      documentacion: { label: 'Documentación', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
      otros: { label: 'Otros', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
    };

    const config = categories[category] || categories.otros;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${config.color}`}>
        <Tag className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'alta':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Alta
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Normal
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">Cargando tareas...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/20 dark:border-gray-700">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-xl">
              <List className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Tareas</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            {/* Barra de búsqueda */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Toggle de Vistas */}
            <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-300 shadow-md transform scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                Lista
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'calendar'
                    ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-300 shadow-md transform scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendario
              </button>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 flex items-center justify-center font-medium group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <>
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  filter === 'all'
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-600/20'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="text-left">
                    <p className="text-sm font-medium opacity-80 mb-1">Total</p>
                    <p className="text-2xl font-bold">Todas las Tareas</p>
                  </div>
                  <div className={`p-3 rounded-xl ${filter === 'all' ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                    <List className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-left relative z-10">
                  <span className="text-3xl font-bold">{tasks.length}</span>
                </div>
              </button>

              <button
                onClick={() => setFilter('pendiente')}
                className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  filter === 'pendiente'
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-xl shadow-yellow-500/20'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="text-left">
                    <p className="text-sm font-medium opacity-80 mb-1">En Progreso</p>
                    <p className="text-2xl font-bold">Por Hacer</p>
                  </div>
                  <div className={`p-3 rounded-xl ${filter === 'pendiente' ? 'bg-white/20' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-left relative z-10">
                  <span className="text-3xl font-bold">{tasks.filter(t => t.status === 'pendiente').length}</span>
                </div>
              </button>

              <button
                onClick={() => setFilter('completada')}
                className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  filter === 'completada'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/20'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="text-left">
                    <p className="text-sm font-medium opacity-80 mb-1">Finalizadas</p>
                    <p className="text-2xl font-bold">Completadas</p>
                  </div>
                  <div className={`p-3 rounded-xl ${filter === 'completada' ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                    <Check className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 text-left relative z-10">
                  <span className="text-3xl font-bold">{tasks.filter(t => t.status === 'completada').length}</span>
                </div>
              </button>
            </div>

            {/* Lista de tareas */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center py-16 animate-fade-in">
                  <div className="bg-gray-50 dark:bg-gray-700/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No se encontraron tareas</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'pendiente' ? '¡Todo al día! No tienes tareas pendientes.' : 
                     filter === 'completada' ? 'Aún no hay tareas completadas.' :
                     'Comienza creando tu primera tarea para empezar.'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 animate-fade-in-up">
                  {filteredTasks.map((task) => (
                    <div key={task._id} className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 ${
                      task.status === 'completada' ? 'opacity-75 hover:opacity-100' : ''
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusBadge(task.status)}
                            {getPriorityBadge(task.priority)}
                            {getCategoryBadge(task.category)}
                          </div>
                          
                          <h3 className={`text-xl font-bold mb-2 ${
                            task.status === 'completada' ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h3>

                          {task.description && (
                            <p className={`text-base mb-4 ${
                              task.status === 'completada' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                            }`}>{task.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center mr-4">
                              <CalendarIcon className="w-4 h-4 mr-1.5" />
                              Creada: {formatDate(task.createdAt)}
                            </span>
                            <span className="flex items-center">
                              <List className="w-4 h-4 mr-1.5" />
                              Por: {task.createdBy?.fullName}
                            </span>
                          </div>
                          
                          {task.completedAt && (
                            <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg w-fit">
                              <Check className="w-4 h-4 mr-1.5" />
                              Completada el {formatDate(task.completedAt)} por {task.completedBy?.fullName}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
                          {task.status === 'pendiente' ? (
                            <button
                              onClick={() => handleCompleteTask(task._id)}
                              className="flex-1 md:w-40 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center font-medium"
                              title="Marcar como completada"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Completar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReopenTask(task._id)}
                              className="flex-1 md:w-40 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center font-medium"
                              title="Volver a pendiente"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reabrir
                            </button>
                          )}
                          {isJefa() && (
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="flex-1 md:w-40 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 px-4 py-2 rounded-xl transition-colors flex items-center justify-center font-medium"
                              title="Eliminar tarea"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Vista de Calendario */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-[700px] border border-gray-100 dark:border-gray-700 animate-fade-in">
            <DnDCalendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onEventDrop={handleEventDrop}
              eventPropGetter={eventStyleGetter}
              messages={{
                next: "Sig",
                previous: "Ant",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Tarea",
                noEventsInRange: "Sin tareas en este rango"
              }}
              className="dark:text-gray-300 custom-calendar"
            />
          </div>
        )}

        {/* Modal para crear tarea */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 dark:border-gray-700 transform transition-all scale-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg mr-3">
                    <Plus className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Ej: Redactar informe mensual"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Detalles adicionales sobre la tarea..."
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha Programada
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                  >
                    <option value="otros">Otros</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="soporte">Soporte</option>
                    <option value="documentacion">Documentación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prioridad
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: 'normal' })}
                      className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center ${
                        formData.priority === 'normal'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: 'alta' })}
                      className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center ${
                        formData.priority === 'alta'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Alta
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-purple-600/30 transition-all hover:-translate-y-0.5"
                  >
                    {isJefa() ? 'Crear Tarea' : 'Registrar Tarea'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
