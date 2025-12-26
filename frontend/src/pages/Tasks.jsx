import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, Check, X, AlertCircle, Clock, Trash2, RotateCcw, Calendar as CalendarIcon, List } from 'lucide-react';
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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [filter, setFilter] = useState('all'); // all, pendiente, completada
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal'
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      setFormData({ title: '', description: '', priority: 'normal' });
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert('Error al crear la tarea');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (error) {
      console.error('Error al completar tarea:', error);
      alert('Error al completar la tarea');
    }
  };

  const handleReopenTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/reopen`);
      fetchTasks();
    } catch (error) {
      console.error('Error al reabrir tarea:', error);
      alert('Error al reabrir la tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea');
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

      // Llamada al API para actualizar fecha (asumiendo que createdAt es la fecha de planificación)
      // Nota: Idealmente deberíamos tener un campo 'dueDate' o 'scheduledDate', pero usaremos createdAt o crearemos un endpoint nuevo
      // Por ahora, solo mostraremos un mensaje ya que el backend necesita soportar cambio de fecha
      console.log('Tarea movida a:', start);
      
      // Aquí iría: await api.patch(`/tasks/${event.id}`, { scheduledDate: start });
      alert('Función de reprogramar fecha pendiente de backend');
      
    } catch (error) {
      console.error('Error al mover tarea:', error);
      fetchTasks(); // Revertir cambios si falla
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#663399'; // Default morado
    
    if (event.resource.status === 'completada') {
      backgroundColor = '#10B981'; // Verde
    } else if (event.resource.priority === 'alta') {
      backgroundColor = '#EF4444'; // Rojo
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
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
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Check className="w-3 h-3 mr-1" /> Completada
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-3 h-3 mr-1" /> Pendiente
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'alta':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertCircle className="w-3 h-3 mr-1" /> Alta
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderBottomColor: '#663399'}}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Tareas</h2>
            
            {/* Toggle de Vistas */}
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                Lista
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white dark:bg-gray-600 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendario
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
          </button>
        </div>

        {viewMode === 'list' ? (
          <>
            {/* Filtros simplificados y grandes (Solo visible en modo lista) */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  filter === 'all'
                    ? 'text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700'
                }`}
                style={filter === 'all' ? {backgroundColor: '#663399'} : {}}
              >
                <div className="text-3xl mb-2">📋</div>
                Todas las Tareas
                <div className="text-sm mt-1 opacity-80">({tasks.length})</div>
              </button>
              <button
                onClick={() => setFilter('pendiente')}
                className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  filter === 'pendiente'
                    ? 'text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700'
                }`}
                style={filter === 'pendiente' ? {backgroundColor: '#8844aa'} : {}}
              >
                <div className="text-3xl mb-2">⏳</div>
                Por Hacer
                <div className="text-sm mt-1 opacity-80">({tasks.filter(t => t.status === 'pendiente').length})</div>
              </button>
              <button
                onClick={() => setFilter('completada')}
                className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  filter === 'completada'
                    ? 'text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700'
                }`}
                style={filter === 'completada' ? {backgroundColor: '#a055cc'} : {}}
              >
                <div className="text-3xl mb-2">✅</div>
                Hechas
                <div className="text-sm mt-1 opacity-80">({tasks.filter(t => t.status === 'completada').length})</div>
              </button>
            </div>

            {/* Lista de tareas */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="card text-center py-16 dark:bg-gray-800 dark:border-gray-700">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No hay tareas aquí</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'pendiente' ? '¡Perfecto! No tienes tareas pendientes' : 
                     filter === 'completada' ? 'Aún no has completado ninguna tarea' :
                     'Comienza creando tu primera tarea'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task._id} className={`card hover:shadow-xl transition-all duration-200 dark:bg-gray-800 ${
                    task.status === 'completada' ? 'bg-green-50 border-2 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 
                    task.priority === 'alta' ? 'bg-red-50 border-2 border-red-200 dark:bg-red-900/10 dark:border-red-800' : 
                    'bg-white border-2 border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center space-x-3 mb-3">
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                        </div>
                        
                        <h3 className={`text-2xl font-bold mb-2 ${
                          task.status === 'completada' ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className={`text-lg mb-3 ${
                            task.status === 'completada' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
                          }`}>{task.description}</p>
                        )}
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Creada por: {task.createdBy?.fullName} - {formatDate(task.createdAt)}
                          </p>
                          {task.completedAt && (
                            <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                              ✅ Completada: {formatDate(task.completedAt)} por {task.completedBy?.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-3 ml-0 md:ml-6">
                        {task.status === 'pendiente' ? (
                          <button
                            onClick={() => handleCompleteTask(task._id)}
                            className="px-6 py-3 text-white rounded-lg transition-colors font-semibold text-lg shadow-md flex items-center justify-center bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500"
                            title="Marcar como completada"
                          >
                            <Check className="w-6 h-6 mr-2" />
                            Marcar como Hecha
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReopenTask(task._id)}
                            className="px-6 py-3 text-white rounded-lg transition-colors font-semibold text-lg shadow-md flex items-center justify-center bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
                            title="Volver a pendiente"
                          >
                            <RotateCcw className="w-6 h-6 mr-2" />
                            Deshacer
                          </button>
                        )}
                        {isJefa() && (
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg shadow-md flex items-center justify-center"
                            title="Eliminar tarea"
                          >
                            <Trash2 className="w-6 h-6 mr-2" />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Vista de Calendario */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[600px] border border-gray-200 dark:border-gray-700">
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
              className="dark:text-gray-200"
            />
          </div>
        )}

        {/* Modal para crear tarea */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Título de la tarea"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    placeholder="Detalles de la tarea (opcional)"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {isJefa() ? 'Crear Tarea' : 'Registrar Tarea'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
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
