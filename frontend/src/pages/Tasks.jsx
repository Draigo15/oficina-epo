import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { Plus, Check, X, AlertCircle, Clock, Trash2, RotateCcw, Search, Edit2, List, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

const Tasks = () => {
  const { isJefa } = useAuth();
  const { success, error } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pendiente, completada
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'calendar'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    dueDate: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
      error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'El título debe tener al menos 3 caracteres';
    } else if (formData.title.trim().length > 200) {
      errors.title = 'El título no puede tener más de 200 caracteres';
    }
    
    if (formData.description && formData.description.length > 1000) {
      errors.description = 'La descripción no puede tener más de 1000 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Por favor corrige los errores en el formulario');
      return;
    }
    
    try {
      await api.post('/tasks', formData);
      setFormData({ title: '', description: '', priority: 'normal', dueDate: '' });
      setFormErrors({});
      setShowModal(false);
      fetchTasks();
      success('Tarea creada exitosamente');
    } catch (err) {
      console.error('Error al crear tarea:', err);
      error('Error al crear la tarea');
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Por favor corrige los errores en el formulario');
      return;
    }
    
    try {
      await api.put(`/tasks/${editingTask._id}`, formData);
      setFormData({ title: '', description: '', priority: 'normal', dueDate: '' });
      setFormErrors({});
      setShowEditModal(false);
      setEditingTask(null);
      fetchTasks();
      success('Tarea actualizada exitosamente');
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      error('Error al actualizar la tarea');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? moment(task.dueDate).format('YYYY-MM-DD') : ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchTasks();
      success('Tarea marcada como completada');
    } catch (err) {
      console.error('Error al completar tarea:', err);
      error('Error al completar la tarea');
    }
  };

  const handleReopenTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/reopen`);
      fetchTasks();
      success('Tarea reabierta correctamente');
    } catch (err) {
      console.error('Error al reabrir tarea:', err);
      error('Error al reabrir la tarea');
    }
  };

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      setShowDeleteModal(false);
      setTaskToDelete(null);
      fetchTasks();
      success('Tarea eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      error('Error al eliminar la tarea');
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Filtrar por estado
    if (filter !== 'all' && task.status !== filter) return false;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(term);
      const descMatch = task.description?.toLowerCase().includes(term);
      return titleMatch || descMatch;
    }
    
    return true;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Verificar si una tarea está vencida
  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'completada') return false;
    return new Date(task.dueDate) < new Date();
  };

  // Verificar si una tarea vence pronto (en los próximos 3 días)
  const isDueSoon = (task) => {
    if (!task.dueDate || task.status === 'completada') return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= threeDaysFromNow;
  };

  // Convertir tareas a eventos del calendario
  const calendarEvents = tasks.map(task => {
    // Usar dueDate si existe, sino createdAt
    const eventDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
    
    return {
      id: task._id,
      title: task.title,
      start: eventDate,
      end: eventDate,
      resource: task,
      allDay: true
    };
  });

  // Estilos personalizados para los eventos del calendario
  const eventStyleGetter = (event) => {
    const task = event.resource;
    let backgroundColor = '#663399'; // morado por defecto
    
    if (task.status === 'completada') {
      backgroundColor = '#10b981'; // verde
    } else if (isOverdue(task)) {
      backgroundColor = '#dc2626'; // rojo oscuro para vencidas
    } else if (task.priority === 'alta') {
      backgroundColor = '#ef4444'; // rojo
    } else if (isDueSoon(task)) {
      backgroundColor = '#f59e0b'; // naranja para que vence pronto
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0',
        display: 'block',
        fontWeight: '600',
        fontSize: '0.875rem'
      }
    };
  };

  // Manejar clic en evento del calendario
  const handleSelectEvent = (event) => {
    const task = event.resource;
    if (isJefa() && task.status === 'pendiente') {
      openEditModal(task);
    }
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Tareas</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Barra de búsqueda */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => {
                setFormData({ title: '', description: '', priority: 'normal', dueDate: '' });
                setFormErrors({});
                setShowModal(true);
              }}
              className="btn-primary flex items-center justify-center whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
            </button>
          </div>
        </div>

        {/* Pestañas de vista */}
        <div className="mb-6 flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <List className="w-5 h-5" />
            Lista
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            Calendario
          </button>
        </div>

        {viewMode === 'list' ? (
          <>
            {/* Filtros simplificados y grandes */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              filter === 'all'
                ? 'text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
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
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
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
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
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
                <div className="card text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No hay tareas aquí</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'pendiente' ? '¡Perfecto! No tienes tareas pendientes' : 
                     filter === 'completada' ? 'Aún no has completado ninguna tarea' :
                     'Comienza creando tu primera tarea'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task._id} className={`card hover:shadow-xl transition-all duration-200 ${
                task.status === 'completada' ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' : 
                isOverdue(task) ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800' :
                task.priority === 'alta' ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800' : 
                isDueSoon(task) ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800' :
                'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-3">
                      {task.status === 'completada' ? (
                        <span className="text-3xl">✅</span>
                      ) : isOverdue(task) ? (
                        <span className="text-3xl">⚠️</span>
                      ) : task.priority === 'alta' ? (
                        <span className="text-3xl">🔴</span>
                      ) : isDueSoon(task) ? (
                        <span className="text-3xl">⏰</span>
                      ) : (
                        <span className="text-3xl">📌</span>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
                      {isOverdue(task) && (
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                          VENCIDA
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-gray-700 dark:text-gray-300 text-lg mb-3 ml-12">{task.description}</p>
                    )}
                    <div className="ml-12 space-y-1">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold mr-2">Prioridad:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          task.priority === 'alta' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                        }`}>
                          {task.priority === 'alta' ? '🔴 Urgente' : '🟣 Normal'}
                        </span>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="font-semibold mr-2">Fecha límite:</span>
                          <span className={`px-2 py-1 rounded-md font-semibold ${
                            isOverdue(task) ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                            isDueSoon(task) ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                            'text-gray-600 dark:text-gray-400'
                          }`}>
                            {formatDateOnly(task.dueDate)}
                          </span>
                        </div>
                      )}
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
                      <>
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          className="px-6 py-3 text-white rounded-lg transition-colors font-semibold text-lg shadow-md flex items-center justify-center"
                          style={{backgroundColor: '#8844aa'}}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#7733aa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#8844aa'}
                          title="Marcar como completada"
                        >
                          <Check className="w-6 h-6 mr-2" />
                          Marcar como Hecha
                        </button>
                        {isJefa() && (
                          <button
                            onClick={() => openEditModal(task)}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg shadow-md flex items-center justify-center"
                            title="Editar tarea"
                          >
                            <Edit2 className="w-6 h-6 mr-2" />
                            Editar
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleReopenTask(task._id)}
                        className="px-6 py-3 text-white rounded-lg transition-colors font-semibold text-lg shadow-md flex items-center justify-center"
                        style={{backgroundColor: '#a055cc'}}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#9944bb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#a055cc'}
                        title="Volver a pendiente"
                      >
                        <RotateCcw className="w-6 h-6 mr-2" />
                        Deshacer
                      </button>
                    )}
                    {isJefa() && (
                      <button
                        onClick={() => confirmDeleteTask(task)}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" style={{ height: '700px' }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              messages={{
                next: 'Siguiente',
                previous: 'Anterior',
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                agenda: 'Agenda',
                date: 'Fecha',
                time: 'Hora',
                event: 'Tarea',
                noEventsInRange: 'No hay tareas en este rango',
                showMore: (total) => `+ Ver más (${total})`
              }}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
            />
          </div>
        )}

        {/* Modal para crear tarea */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                    }}
                    className={`input-field ${formErrors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Título de la tarea (mín. 3 caracteres)"
                    maxLength="200"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formData.title.length}/200 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: null });
                    }}
                    className={`input-field ${formErrors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Detalles de la tarea (opcional)"
                    rows="3"
                    maxLength="1000"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formData.description.length}/1000 caracteres</p>
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
                    <option value="normal">🟣 Normal</option>
                    <option value="alta">🔴 Alta - Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha límite (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.dueDate ? `📅 ${formatDateOnly(formData.dueDate)}` : 'Sin fecha límite'}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {isJefa() ? 'Crear Tarea' : 'Registrar Tarea'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormErrors({});
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para editar tarea */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Editar Tarea
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTask(null);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleEditTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                    }}
                    className={`input-field ${formErrors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Título de la tarea (mín. 3 caracteres)"
                    maxLength="200"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formData.title.length}/200 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: null });
                    }}
                    className={`input-field ${formErrors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Detalles de la tarea (opcional)"
                    rows="3"
                    maxLength="1000"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formData.description.length}/1000 caracteres</p>
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
                    <option value="normal">🟣 Normal</option>
                    <option value="alta">🔴 Alta - Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha límite (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.dueDate ? `📅 ${formatDateOnly(formData.dueDate)}` : 'Sin fecha límite'}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Actualizar Tarea
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingTask(null);
                      setFormErrors({});
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmación para eliminar */}
        {showDeleteModal && taskToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirmar Eliminación</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Esta acción no se puede deshacer</p>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                ¿Estás seguro de que deseas eliminar la tarea <span className="font-bold">"{taskToDelete.title}"</span>?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteTask}
                  className="flex-1 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors font-semibold"
                >
                  Sí, Eliminar
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTaskToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
